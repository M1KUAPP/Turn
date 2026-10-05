import { describe, expect, test } from 'vitest'
import { setBoardSplash } from '../plugins/withBoardSplash'

describe('color-only iOS launch screen', () => {
  test('uses the board color asset and removes image remnants', () => {
    const storyboard = {
      document: {
        scenes: [
          {
            scene: [
              {
                objects: [
                  {
                    viewController: [
                      {
                        view: [
                          {
                            color: [{ $: { key: 'backgroundColor', systemColor: 'systemBackgroundColor' } }],
                            constraints: [{ constraint: [{ $: { firstItem: 'EXPO-SplashScreen' } }] }],
                            subviews: [{ imageView: [{ $: { image: 'SplashScreenLogo' } }] }]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
        resources: [
          { image: [{ $: { name: 'SplashScreenLogo' } }], systemColor: [{ $: { name: 'systemBackgroundColor' } }] }
        ]
      }
    }

    setBoardSplash(storyboard, '#F2F2F7')

    const view = storyboard.document.scenes[0].scene[0].objects[0].viewController[0].view[0]
    expect(view.color).toEqual([{ $: { key: 'backgroundColor', name: 'SplashScreenBackground' } }])
    expect(view).not.toHaveProperty('subviews')
    expect(view).not.toHaveProperty('constraints')
    expect(storyboard.document.resources[0]).not.toHaveProperty('image')
    expect(storyboard.document.resources[0]).not.toHaveProperty('systemColor')
    expect(storyboard.document.resources[0]).toHaveProperty('namedColor')
  })
})
