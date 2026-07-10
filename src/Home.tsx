import { Settings, Plus, Spade, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import CreateGameDrawer from "./CreateGameDrawer.tsx";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans sm:hidden p-4 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <h1 className="text-2xl font-black bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">
          Ghi Điểm Đánh Bài
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="bg-[#1c1c1e] text-gray-400 hover:bg-[#2a2a2c] hover:text-white rounded-2xl h-12 w-12 flex items-center justify-center"
        >
          <Settings size={24} />
        </Button>
      </div>

      {/* Main Action Card */}
      <Drawer>
        <DrawerTrigger asChild>
          <div 
            className="mt-4 relative bg-[#d60000] rounded-[2rem] p-6 flex items-center justify-between cursor-pointer overflow-hidden shadow-[0_4px_30px_rgba(214,0,0,0.3)] active:scale-95 transition-transform"
          >
            <div className="relative z-10 w-[88px] h-[88px] bg-white rounded-2xl flex items-center justify-center shadow-inner overflow-hidden">
                {/* Simple representation of cards */}
                <div className="flex gap-1 -rotate-12 transform scale-150">
                    <span className="text-3xl filter drop-shadow-md">🂡</span>
                    <span className="text-3xl filter drop-shadow-md -ml-4">🂢</span>
                    <span className="text-3xl filter drop-shadow-md -ml-4">🂣</span>
                    <span className="text-3xl filter drop-shadow-md -ml-4">🂤</span>
                </div>
            </div>
            <div className="relative z-10 flex items-center gap-1 pr-2">
                <span className="text-[32px] font-bold text-white tracking-tight leading-none">Tiến Lên</span>
                <Plus size={36} className="text-white" strokeWidth={2} />
            </div>
          </div>
        </DrawerTrigger>
        <DrawerContent className="bg-[#0a0a0a] border-white/5 outline-none overflow-hidden p-0">
          <CreateGameDrawer />
        </DrawerContent>
      </Drawer>

      {/* History List */}
      <div className="flex flex-col gap-4 mt-6">
        {[
          { players: 0, round: 1, time: "09/07 17:40", bet: "1K" },
          { players: 4, round: 3, time: "09/07 17:33", bet: "1K" }
        ].map((item, idx) => (
          <div key={idx} className="bg-[#161618] rounded-3xl p-5 flex items-center justify-between relative overflow-hidden">
            {/* Left red accent line */}
            <div className="absolute left-0 top-6 bottom-6 w-1 bg-red-500 rounded-r-full" />
            
            <div className="flex items-center gap-5 pl-2">
              <div className="w-[52px] h-[52px] rounded-2xl bg-[#2a1114] flex items-center justify-center text-[#ff3333]">
                <Spade size={28} fill="currentColor" strokeWidth={0} />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center">
                  <span className="text-[10px] font-bold tracking-wider bg-[#2a1114] text-[#ff3333] px-2.5 py-1 rounded-md uppercase">
                    Tiến Lên / Thứ Tự
                  </span>
                </div>
                <div className="text-[11px] text-gray-400 font-semibold tracking-wide">
                  {item.players} NGƯỜI • VÁN {item.round}
                </div>
                <div className="text-[20px] font-bold text-white leading-none mt-0.5">
                  {item.time}
                </div>
                <div className="text-[11px] text-gray-500 font-bold tracking-wide mt-0.5">
                  CƯỢC: {item.bet}
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-red-400 hover:bg-red-950/20 rounded-xl h-10 w-10 mr-2"
            >
              <Trash2 size={22} />
            </Button>
          </div>
        ))}
      </div>

    </div>
  );
}
