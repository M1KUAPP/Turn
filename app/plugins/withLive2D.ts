import { existsSync } from 'node:fs'
import { join, relative } from 'node:path'
import { IOSConfig, withXcodeProject, type ConfigPlugin } from 'expo/config-plugins'

type FileReference = { path?: string; lastKnownFileType?: string; fileEncoding?: unknown; explicitFileType?: unknown }

// Copies the companion's live renderer, app/live2d/build/Live2D from scripts/fetch-companion-models.ts, into the app as
// a folder, so the web view loads Live2D/index.html from the bundle (plan 0049). Without a build the app has no folder,
// app.config.ts's extra.live2d is false, and the face keeps to its frames.
const withLive2D: ConfigPlugin = (config) =>
  withXcodeProject(config, (config) => {
    const { projectRoot, platformProjectRoot } = config.modRequest
    const folder = join(projectRoot, 'live2d/build/Live2D')
    if (!existsSync(join(folder, 'index.html'))) return config
    const project = config.modResults
    const path = relative(platformProjectRoot, folder)
    IOSConfig.XcodeUtils.addResourceFileToGroup({ filepath: path, groupName: '', project, isBuildFile: true })
    // A folder reference, so Xcode copies the folder whole and the page's paths hold.
    const references = project.pbxFileReferenceSection() as Record<string, FileReference | string>
    for (const reference of Object.values(references)) {
      if (typeof reference !== 'object' || reference.path?.replaceAll('"', '') !== path) continue
      reference.lastKnownFileType = 'folder'
      delete reference.fileEncoding
      delete reference.explicitFileType
    }
    return config
  })

export default withLive2D
