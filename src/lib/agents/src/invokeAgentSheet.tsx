import { Button } from "@/components/ui/button";

import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { useRef, useState } from "react";
import { AgentInvokeParameters } from "../model";
import ReactJson from "react-json-view";
import Papa from "papaparse";
import { X } from "lucide-react";

export function InvokeAgentSheet(params: {
  onInvoke: (parameters: AgentInvokeParameters) => void;
}) {
  const { onInvoke } = params;
  const [parameters, setParameters] = useState<Record<string, unknown>[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    setParameters([...parameters, {}]);
  };

  const handleRemove = (index: number) => {
    setParameters(parameters.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, newValue: Record<string, unknown>) => {
    const updatedParams = [...parameters];
    updatedParams[index] = newValue;
    setParameters(updatedParams);
  };

  const handleSubmit = () => {
    onInvoke(parameters);
  };

  const handleAddFromCsv = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const newParameters = results.data as Record<string, unknown>[];
        setParameters([...parameters, ...newParameters]);
      },
      error: (error) => {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  return (
    <SheetContent className="flex flex-col">
      <SheetHeader>
        <SheetTitle>Invoke an agent</SheetTitle>
        <SheetDescription>
          Add the parameters you want to invoke the agent with
        </SheetDescription>
      </SheetHeader>

      <div className="flex flex-col gap-4 py-4 h-full">
        <Button variant="outline" onClick={handleAdd}>
          Add Parameter
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            fileInputRef.current?.click();
          }}
        >
          Import Parameters from csv
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="csv"
          hidden
          multiple={false}
          onChange={handleAddFromCsv}
        ></input>
        {parameters.map((param, index) => (
          <div key={index} className="flex items-start justify-between">
            <ReactJson
              src={param}
              name={false}
              onAdd={(e) =>
                handleUpdate(index, e.updated_src as Record<string, unknown>)
              }
              onDelete={(e) =>
                handleUpdate(index, e.updated_src as Record<string, unknown>)
              }
              onEdit={(e) =>
                handleUpdate(index, e.updated_src as Record<string, unknown>)
              }
            />
            <Button
              variant="ghost"
              className="h-8 w-8"
              onClick={() => handleRemove(index)}
            >
              <X size="sm" />
            </Button>
          </div>
        ))}
      </div>

      <SheetFooter>
        <SheetClose asChild>
          <Button onClick={handleSubmit}>Invoke agent</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}
