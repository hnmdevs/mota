import { TutorialStep } from '@/types/tutorial'

const segmentId = 'basic'

export const endSteps: TutorialStep[] = [
  {
    elementXpath: 'div.rf__wrapper',
    segmentId,
    title: 'Congratulations 🎉',
    description: `You've completed our Mota basics tutorial!<br/><br/> You've learned about Mota's primitives, how to navigate around Workbench, and how to use core features from the Mota framework (state management, logging, and tracing).<br/><br/> We recommend you give our <a href="https://www.mota.imoogle.com/docs/getting-started/core-concepts" target="_blank">core concepts</a> a read if you wish to learn further about Mota's fundamentals.<br/><br/> Don't forget to join our <a href="https://discord.com/invite/nJFfsH5d6v" target="_blank">Discord community</a> or tag us in socials to show us what you've built with Mota.<br/><br/> We are an open source project, so feel free to raise your <a href="https://github.com/MotaDev/mota/issues" target="_blank">issues</a> or <a href="https://github.com/MotaDev/mota/discussions" target="_blank">suggestions</a> in our <a href="https://github.com/MotaDev/mota" target="_blank">Github repo</a>.<br/><br/> On behalf of the Mota team, we want to say thank you for giving Mota a try!`,
    id: 'end',
  },
]
