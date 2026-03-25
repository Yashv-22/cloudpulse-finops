import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Terminal, Copy, CheckCircle2 } from "lucide-react"
import { useState } from "react"

interface RemediationDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  why: string
  cliCommand: string
  terraformSnippet: string
  riskLevel: "Low" | "Medium" | "High"
  onAction?: () => void
  actionLabel?: string
  actionLoading?: boolean
}

export function RemediationDialog({
  isOpen, onClose, title, why, cliCommand, terraformSnippet, riskLevel, onAction, actionLabel, actionLoading
}: RemediationDialogProps) {
  const [copiedCli, setCopiedCli] = useState(false)
  const [copiedTf, setCopiedTf] = useState(false)
  const [activeTab, setActiveTab] = useState<'cli' | 'tf'>('cli')

  const copyToClipboard = (text: string, type: 'cli' | 'tf') => {
    navigator.clipboard.writeText(text)
    if (type === 'cli') {
      setCopiedCli(true); setTimeout(() => setCopiedCli(false), 2000)
    } else {
      setCopiedTf(true); setTimeout(() => setCopiedTf(false), 2000)
    }
  }

  const riskColors = {
    Low: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    Medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    High: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              {title}
            </DialogTitle>
            <Badge variant="outline" className={riskColors[riskLevel]}>
              {riskLevel} Risk
            </Badge>
          </div>
          <DialogDescription className="text-sm font-medium text-foreground/80 bg-muted/50 p-3 rounded-md border border-border/50">
            <span className="font-bold text-primary mr-2">The Why:</span>
            {why}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="grid grid-cols-2 mb-4 bg-muted/50 p-1 rounded-md">
            <Button size="sm" variant={activeTab === 'cli' ? 'default' : 'ghost'} onClick={() => setActiveTab('cli')}>AWS CLI</Button>
            <Button size="sm" variant={activeTab === 'tf' ? 'default' : 'ghost'} onClick={() => setActiveTab('tf')}>Terraform</Button>
          </div>
          
          {activeTab === 'cli' && (
            <div className="relative group mt-0">
              <div className="absolute right-2 top-2">
                <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => copyToClipboard(cliCommand, 'cli')}>
                  {copiedCli ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto text-sm text-green-400 font-mono border border-border/50">
                <code>{cliCommand}</code>
              </pre>
            </div>
          )}
          
          {activeTab === 'tf' && (
            <div className="relative group mt-0">
              <div className="absolute right-2 top-2">
                <Button size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={() => copyToClipboard(terraformSnippet, 'tf')}>
                  {copiedTf ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="bg-[#1e1e1e] p-4 rounded-lg overflow-x-auto text-sm text-blue-400 font-mono border border-border/50">
                <code>{terraformSnippet}</code>
              </pre>
            </div>
          )}
        </div>

        {onAction && actionLabel && (
          <div className="mt-2 pt-4 border-t border-border flex justify-end gap-3">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button variant={riskLevel === 'High' ? "destructive" : "default"} onClick={onAction} disabled={actionLoading}>
              {actionLoading ? "Executing..." : actionLabel}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
