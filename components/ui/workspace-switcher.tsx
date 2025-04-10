"use client"

import * as React from "react"
import Image from "next/image"
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"

type Workspace = {
  id: string
  name: string
  icon?: string
  current?: boolean
  favicon_file?: any
}

interface WorkspaceSwitcherProps {
  workspaces: Workspace[]
  className?: string
}

export function WorkspaceSwitcher({ workspaces, className }: WorkspaceSwitcherProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedWorkspace, setSelectedWorkspace] = React.useState<Workspace>(
    workspaces.find((workspace) => workspace.current) || workspaces[0],
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a workspace"
          className={cn("w-full justify-between", className)}
        >
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              {selectedWorkspace?.favicon_file ? (
                <Image
                  src={selectedWorkspace.favicon_file.url || "/placeholder.svg"}
                  alt={selectedWorkspace.name}
                  width={48}
                  height={48}
                  className="w-10 h-10 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-md bg-primary/10" />
              )}
            </div>
            <div className="grid">
              <span className="text-sm text-left font-bold text-neutral-900">{selectedWorkspace?.name}</span>
              <span className="text-xs text-neutral-600"> Espaço atual </span>
            </div>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandList>
            <CommandInput placeholder="Pesquisar espaço..." className="border-none focus:ring-0 px-3" />
            <CommandEmpty>Nenhum espaço encontrado.</CommandEmpty>
            <CommandGroup heading="Espaços">
              {workspaces.map((workspace) => (
                <CommandItem
                  key={workspace.id}
                  onSelect={() => {
                    setSelectedWorkspace(workspace)
                    setOpen(false)
                  }}
                  className="text-sm"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="relative w-10 h-10 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                      {selectedWorkspace?.favicon_file ? (
                        <Image
                          src={selectedWorkspace.favicon_file.url || "/placeholder.svg"}
                          alt={selectedWorkspace.name}
                          width={48}
                          height={48}
                          className="w-10 h-10 object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-md bg-primary/10" />
                      )}
                    </div>
                    {workspace.name}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedWorkspace.id === workspace.id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setOpen(false)
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Criar novo espaço
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

