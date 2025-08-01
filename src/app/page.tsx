import { ChatInterface } from "@/components/chat-interface";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-lg shadow-xl">
        <ChatInterface />
      </div>
    </main>
  );
}
