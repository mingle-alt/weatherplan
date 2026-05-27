import { IoChatbubbleEllipses } from 'react-icons/io5'

interface Props { onClick: () => void }

export default function FloatingChatButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-4 z-40 w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      aria-label="AI 챗봇 열기"
    >
      <IoChatbubbleEllipses className="text-white text-2xl" />
    </button>
  )
}
