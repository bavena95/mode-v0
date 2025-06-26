"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from 'date-fns';

// O componente agora recebe o histórico e o índice atual como props
export function HistoryPanel({ history, currentIndex, onJumpToAction }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground pt-10">
        No actions yet.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-1">
          {history.map((item, index) => (
            <div
              key={item.id}
              onClick={() => onJumpToAction(index)}
              className={`flex items-center justify-between rounded-md p-2 transition-all group cursor-pointer ${
                index === currentIndex
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-accent/50 hover:bg-accent"
              }`}
            >
              <div>
                <p className={`text-sm font-medium ${index === currentIndex ? 'text-primary-foreground' : 'text-foreground'}`}>
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </p>
              </div>
              <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}