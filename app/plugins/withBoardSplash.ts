import { withMod, type ConfigPlugin } from 'expo/config-plugins'

type Storyboard = {
  document: {
    scenes: { scene: { objects: { viewController: { view: Record<string, unknown>[] }[] }[] }[] }[]
    resources: Record<string, unknown>[]
  }
}

export function setBoardSplash(storyboard: Storyboard, backgroundColor: string) {
  const view = storyboard.document.scenes[0].scene[0].objects[0].viewController[0].view[0]
  const resources = storyboard.document.resources[0]
  const channels = [1, 3, 5].map((index) =>
    (Number.parseInt(backgroundColor.slice(index, index + 2), 16) / 255).toString()
  )

  view.color = [{ $: { key: 'backgroundColor', name: 'SplashScreenBackground' } }]
  delete view.subviews
  delete view.constraints
  delete resources.image
  delete resources.systemColor
  resources.namedColor = [
    {
      $: { name: 'SplashScreenBackground' },
      color: [
        {
          $: {
            alpha: '1',
            red: channels[0],
            green: channels[1],
            blue: channels[2],
            colorSpace: 'custom',
            customColorSpace: 'sRGB'
          }
        }
      ]
    }
  ]
}

const withBoardSplash: ConfigPlugin<{ backgroundColor: string }> = (config, { backgroundColor }) =>
  withMod(config, {
    platform: 'ios',
    mod: 'splashScreenStoryboard' as never,
    action: async (config) => {
      setBoardSplash(config.modResults as Storyboard, backgroundColor)
      return config
    }
  })

export default withBoardSplash
