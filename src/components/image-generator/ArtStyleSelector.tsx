
import React from 'react';
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ART_STYLE_CATEGORIES } from './constants';
import { useToast } from "@/hooks/use-toast";

interface ArtStyleSelectorProps {
  artStyle: string;
  setArtStyle: (style: string) => void;
}

const ArtStyleSelector: React.FC<ArtStyleSelectorProps> = ({ 
  artStyle, 
  setArtStyle 
}) => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const { toast } = useToast();

  const selectArtStyle = (style: string) => {
    setArtStyle(style);
    setDialogOpen(false);
    toast({
      title: "Art Style Selected",
      description: `Selected style: ${style}`,
    });
  };

  return (
    <div>
      {artStyle && (
        <Badge variant="outline" className="mr-1 mb-1 p-1.5">
          Style: {artStyle}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-4 w-4 p-0 ml-1"
            onClick={() => setArtStyle("")}
          >
            ×
          </Button>
        </Badge>
      )}
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full md:w-auto">
            <Palette className="h-4 w-4 mr-2" />
            {artStyle ? `Style: ${artStyle}` : "Select Art Style"}
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose an Art Style</DialogTitle>
            <DialogDescription>
              Select from over 100 unique AI art styles to enhance your image generation
            </DialogDescription>
          </DialogHeader>
          
          <Accordion type="single" collapsible className="w-full">
            {ART_STYLE_CATEGORIES.map((category, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`}>
                <AccordionTrigger className="text-lg font-medium">
                  {category.name}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {category.styles.map((style, styleIdx) => (
                      <Button 
                        key={styleIdx} 
                        variant="outline" 
                        onClick={() => selectArtStyle(style)}
                        className="justify-start h-auto py-2 text-sm"
                      >
                        {style}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ArtStyleSelector;
