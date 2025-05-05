import ChatPanel from "@/components/planning/ChatPanel";
import PhaseSidebar from "@/components/planning/PhaseSidebar";
import TabbedInfoPanel from "@/components/planning/TabbedInfoPanel";

export default function CommandPanel() {
  return (
    <div className="flex h-screen w-full">
      <aside className="w-20 border-r bg-gray-50 p-2">
        <PhaseSidebar />
      </aside>

      <main className="flex flex-col flex-1">
        <section className="flex-1 overflow-y-auto p-4 border-b">
          <ChatPanel />
        </section>

        <section className="h-[40%] border-t bg-white p-2">
          <TabbedInfoPanel />
        </section>
      </main>
    </div>
  );
}
