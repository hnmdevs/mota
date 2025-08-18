import { TutorialStep } from '@/types/tutorial'

const segmentId = 'basic'

export const endSteps: TutorialStep[] = [
  {
    elementXpath: 'div.rf__wrapper',
    segmentId,
    title: 'Congratulations 🎉',
    description: `You've completed our Motia basics tutorial!<br/><br/> You've learned about Motia's primitives, how to navigate around Workbench, and how to use core features from the Motia framework (state management, logging, and tracing).<br/><br/> Check the local documentation to learn more about Motia's fundamentals.<br/><br/> On behalf of the imoogle team, we want to say thank you for giving Motia a try!<br/><br/> <em>Powered by imoogle</em>`,
    id: 'end',
  },
]
