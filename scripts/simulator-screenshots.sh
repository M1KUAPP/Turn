#!/usr/bin/env bash
set -euo pipefail

usage() {
  printf 'Usage: %s <Turn.app> <output-directory> <pr|full|dark|small>\n' "$0" >&2
  exit 2
}

[[ $# -eq 3 ]] || usage

app_path=$1
out_dir=$2
mode=$3

case "$mode" in
  pr|full|dark|small) ;;
  *) usage ;;
esac

if [[ ! -d "$app_path" ]]; then
  printf 'Simulator app not found: %s\n' "$app_path" >&2
  exit 2
fi

app_path="$(cd "$app_path" && pwd -P)"
mkdir -p "$out_dir"
out_dir="$(cd "$out_dir" && pwd -P)"

for command_name in xcrun jq plutil; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    printf 'Required command not found: %s\n' "$command_name" >&2
    exit 2
  fi
done

if ! command -v maestro >/dev/null 2>&1; then
  printf 'Maestro CLI is not on PATH.\n' >&2
  exit 2
fi
maestro_bin="$(command -v maestro)"

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
repo_root="$(cd "$script_dir/.." && pwd -P)"
flow_dir="$repo_root/app/maestro"
flow_files=()
for flow_path in "$flow_dir"/*.yaml "$flow_dir"/*.yml; do
  if [[ -f "$flow_path" ]]; then
    flow_files+=("$flow_path")
  fi
done
# FLOWS, when set, keeps only the named flows (space- or comma-separated, without .yaml), for a quick rerun.
if [[ -n "${FLOWS:-}" ]]; then
  kept=()
  for flow_path in "${flow_files[@]}"; do
    flow_name="$(basename "$flow_path")"
    [[ " ${FLOWS//,/ } " == *" ${flow_name%.*} "* ]] && kept+=("$flow_path")
  done
  flow_files=("${kept[@]}")
fi
if [[ ${#flow_files[@]} -eq 0 ]]; then
  printf 'No Maestro flows found in %s\n' "$flow_dir" >&2
  exit 2
fi

runtime_json="$(xcrun simctl list runtimes --json)"
newest_runtime="$(jq -c '
  [.runtimes[] | select(.isAvailable == true and .platform == "iOS")]
  | sort_by(.version | split(".") | map(tonumber))
  | last
' <<<"$runtime_json")"
if [[ -z "$newest_runtime" || "$newest_runtime" == null ]]; then
  printf 'No available iOS Simulator runtime was found.\n' >&2
  exit 2
fi
runtime_id="$(jq -r '.identifier' <<<"$newest_runtime")"
runtime_version="$(jq -r '.version' <<<"$newest_runtime")"
device_types_json="$(xcrun simctl list devicetypes --json)"
devices_json="$(xcrun simctl list devices --json)"

selected_device_id=
selected_device_name=

select_or_create_device() {
  local device_name=$1
  local device_id
  local device_type

  device_id="$(jq -r --arg runtime "$runtime_id" --arg name "$device_name" '
    ([.devices[$runtime][]? | select(.isAvailable == true and .name == $name) | .udid][0])
    // empty
  ' <<<"$devices_json")"
  if [[ -n "$device_id" ]]; then
    selected_device_id=$device_id
    selected_device_name=$device_name
    return 0
  fi

  device_type="$(jq -r --arg name "$device_name" '
    ([.devicetypes[] | select(.productFamily == "iPhone" and .name == $name) | .identifier][0])
    // empty
  ' <<<"$device_types_json")"
  [[ -n "$device_type" ]] || return 1

  if device_id="$(xcrun simctl create "$device_name" "$device_type" "$runtime_id" 2>/dev/null)"; then
    selected_device_id=$device_id
    selected_device_name=$device_name
    devices_json="$(xcrun simctl list devices --json)"
    return 0
  fi
  return 1
}

choose_large_device() {
  local candidate
  for candidate in 'iPhone 16' 'iPhone 15 Pro'; do
    if select_or_create_device "$candidate"; then
      LARGE_DEVICE_ID=$selected_device_id
      LARGE_DEVICE_NAME=$selected_device_name
      return 0
    fi
  done
  printf 'No iPhone 16 or iPhone 15 Pro simulator is available.\n' >&2
  return 1
}

choose_small_device() {
  local candidate
  local device_types
  local device_name
  local bundle_path
  local capabilities_path
  local capabilities_json
  local is_large
  local dimensions
  local width
  local height
  local scale
  local area
  local ranked_devices=

  for candidate in 'iPhone SE (3rd generation)' 'iPhone 16e'; do
    if select_or_create_device "$candidate"; then
      SMALL_DEVICE_ID=$selected_device_id
      SMALL_DEVICE_NAME=$selected_device_name
      return 0
    fi
  done

  device_types="$(jq -r '
    .devicetypes[]
    | select(.productFamily == "iPhone" and (.name | startswith("iPhone")))
    | [.name, .bundlePath]
    | @tsv
  ' <<<"$device_types_json")"
  while IFS=$'\t' read -r device_name bundle_path; do
    [[ -n "$device_name" ]] || continue
    capabilities_path="$bundle_path/Contents/Resources/capabilities.plist"
    [[ -f "$capabilities_path" ]] || continue
    capabilities_json="$(plutil -convert json -o - "$capabilities_path" 2>/dev/null || true)"
    [[ -n "$capabilities_json" ]] || continue
    is_large="$(jq -r '.IsLargeFormatPhone // false' <<<"$capabilities_json")"
    [[ "$is_large" == true ]] && continue

    dimensions="$(jq -r '
      .ScreenDimensionsCapability as $screen
      | [
          ($screen["main-screen-width"] // 0),
          ($screen["main-screen-height"] // 0),
          ($screen["main-screen-scale"] // 0)
        ]
      | @tsv
    ' <<<"$capabilities_json")"
    IFS=$'\t' read -r width height scale <<<"$dimensions"
    [[ "$width" =~ ^[0-9]+$ && "$height" =~ ^[0-9]+$ && "$scale" =~ ^[0-9]+$ ]] || continue
    (( scale > 0 )) || continue
    area="$(awk -v width="$width" -v height="$height" -v scale="$scale" \
      'BEGIN { printf "%.0f", width * height / (scale * scale) }')"
    ranked_devices+="$area"$'\t'"$device_name"$'\n'
  done <<<"$device_types"

  while IFS=$'\t' read -r _ device_name; do
    [[ -n "$device_name" ]] || continue
    if select_or_create_device "$device_name"; then
      SMALL_DEVICE_ID=$selected_device_id
      SMALL_DEVICE_NAME=$selected_device_name
      return 0
    fi
  done < <(printf '%s' "$ranked_devices" | sort -n -k1,1)

  printf 'No iPhone simulator is available for the full run.\n' >&2
  return 1
}

if [[ "$mode" != small ]] && ! choose_large_device; then
  exit 2
fi
if [[ "$mode" == full || "$mode" == small ]] && ! choose_small_device; then
  exit 2
fi

printf 'Using iOS %s runtime.\n' "$runtime_version"

# busy-relay.yaml is scenario 7, with the relay's address blocked (STATE-2). The Simulator resolves names through the
# Mac, so an /etc/hosts entry for the relay in app/app.config.ts blocks it for that flow alone.
relay_host=turn-relay.m1ku-turn.workers.dev
flush_dns() {
  sudo dscacheutil -flushcache
  sudo killall -HUP mDNSResponder
}
block_relay() {
  # The leading newline keeps the first entry off the file's last line, when it has no newline of its own.
  printf '\n127.0.0.1 %s\n::1 %s\n' "$relay_host" "$relay_host" | sudo tee -a /etc/hosts >/dev/null
  trap unblock_relay EXIT
  flush_dns
  dscacheutil -q host -a name "$relay_host" || true
}
unblock_relay() {
  local host_pattern=${relay_host//./\\.}
  sudo sed -i '' -e "/^127\.0\.0\.1 $host_pattern\$/d" -e "/^::1 $host_pattern\$/d" /etc/hosts
  trap - EXIT
  flush_dns
}

run_combination() {
  local device_id=$1
  local device_name=$2
  local text_size=$3
  local appearance=$4
  local device_out="$out_dir/$device_name"
  local combination_dir="$device_out/$text_size-$appearance"
  local device_state
  local flow_path
  local flow_name
  local artifacts_dir
  local flow_result
  local attempt
  local screenshot_path
  local screenshot_name

  mkdir -p "$combination_dir"
  device_state="$(xcrun simctl list devices --json | jq -r \
    --arg runtime "$runtime_id" --arg udid "$device_id" '
      .devices[$runtime][]? | select(.udid == $udid) | .state
    ')"
  if [[ "$device_state" != Booted ]]; then
    xcrun simctl boot "$device_id"
  fi
  xcrun simctl bootstatus "$device_id" -b
  xcrun simctl status_bar "$device_id" override \
    --time '9:41' \
    --dataNetwork wifi \
    --wifiMode active \
    --wifiBars 3 \
    --cellularMode active \
    --cellularBars 4 \
    --batteryState charged \
    --batteryLevel 100
  xcrun simctl ui "$device_id" appearance "$appearance"
  xcrun simctl ui "$device_id" content_size "$text_size"
  xcrun simctl install "$device_id" "$app_path"

  for flow_path in "${flow_files[@]}"; do
    flow_name="$(basename "$flow_path")"
    flow_name=${flow_name%.*}
    artifacts_dir="$combination_dir/maestro-artifacts/$flow_name"
    mkdir -p "$artifacts_dir"
    # Turn's own log during the flow, for errors a screenshot can't show, such as RevenueCat's.
    xcrun simctl spawn "$device_id" log stream --style compact --level info \
      --predicate 'process == "Turn"' >"$artifacts_dir/device.log" 2>&1 &
    log_pid=$!
    if [[ $flow_name == busy-relay ]]; then
      block_relay
    fi

    # Maestro's driver can time out starting on a cold runner, before any step runs; only that gets one retry.
    for attempt in 1 2; do
      if (
        cd "$combination_dir"
        "$maestro_bin" --device "$device_id" test \
          --test-output-dir "$artifacts_dir" "$flow_path"
      ) 2>&1 | tee "$artifacts_dir/maestro-$attempt.log"; then
        flow_result=PASS
        break
      fi
      flow_result=FAIL
      grep -q IOSDriverTimeoutException "$artifacts_dir/maestro-$attempt.log" || break
    done
    kill "$log_pid" 2>/dev/null || true
    if [[ $flow_name == busy-relay ]]; then
      unblock_relay
    fi
    if [[ $flow_result == FAIL ]]; then
      failures=$((failures + 1))
    fi
    printf '%s\t%s-%s\t%s\t%s\n' \
      "$device_name" "$text_size" "$appearance" "$flow_name" "$flow_result" \
      >>"$out_dir/results.txt"

    while IFS= read -r screenshot_path; do
      screenshot_name=${screenshot_path##*/}
      cp "$screenshot_path" "$combination_dir/$screenshot_name"
    done < <(find "$artifacts_dir" -type f -name "$flow_name-*.png" -print)
  done
}

failures=0
: >"$out_dir/results.txt"
printf 'device\tcombination\tflow\tresult\n' >>"$out_dir/results.txt"

# pr: iPhone 16 at the default size and AX5. dark: iPhone 16 dark. small: the iPhone SE at both sizes.
# full: all five.
if [[ "$mode" == pr || "$mode" == full ]]; then
  run_combination "$LARGE_DEVICE_ID" "$LARGE_DEVICE_NAME" large light
  run_combination \
    "$LARGE_DEVICE_ID" "$LARGE_DEVICE_NAME" \
    accessibility-extra-extra-extra-large light
fi
if [[ "$mode" == full || "$mode" == dark ]]; then
  run_combination "$LARGE_DEVICE_ID" "$LARGE_DEVICE_NAME" large dark
fi
if [[ "$mode" == full || "$mode" == small ]]; then
  run_combination "$SMALL_DEVICE_ID" "$SMALL_DEVICE_NAME" large light
  run_combination \
    "$SMALL_DEVICE_ID" "$SMALL_DEVICE_NAME" \
    accessibility-extra-extra-extra-large light
fi

if (( failures > 0 )); then
  printf '%s Maestro flow(s) failed. See %s/results.txt.\n' \
    "$failures" "$out_dir" >&2
  exit 1
fi
