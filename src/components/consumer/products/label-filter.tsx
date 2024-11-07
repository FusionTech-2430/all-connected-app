import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

interface LabelFilterProps {
  labels: { id: number; label: string }[]
  selectedLabels: string[]
  onLabelChange: (label: string) => void
}

export function LabelFilter({ labels, selectedLabels, onLabelChange }: LabelFilterProps) {
  return (
    <div className="w-full md:w-1/5 mb-4 md:mb-0">
      <h3 className="font-bold mb-2">Filtrar por etiquetas:</h3>
      <div className="space-y-2">
        {labels.map((label) => (
          <div key={label.id} className="flex items-center">
            <Checkbox
              id={`label-${label.id}`}
              checked={selectedLabels.includes(label.label)}
              onCheckedChange={() => onLabelChange(label.label)}
            />
            <Label htmlFor={`label-${label.id}`} className="ml-2 text-sm">
              {label.label}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )
}