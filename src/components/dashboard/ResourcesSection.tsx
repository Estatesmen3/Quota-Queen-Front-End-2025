
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ResourcesSection: React.FC = () => {
  return (
    <motion.div variants={{
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 100
        }
      }
    }}>
      <Card className="overflow-hidden border-t-4 border-dopamine-blue transition-all duration-300 hover:shadow-lg hover:shadow-dopamine-blue/20">
        <CardHeader className="bg-gradient-to-r from-dopamine-blue/15 to-dopamine-purple/5">
          <CardTitle>Recommended Resources</CardTitle>
          <CardDescription>Expand your sales knowledge</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            <div className="group cursor-pointer">
              <div className="bg-muted rounded-lg p-3 group-hover:bg-gradient-to-r group-hover:from-background group-hover:to-muted/60 transition-colors duration-300 transform group-hover:translate-x-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">Handling Price Objections</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Learn 5 proven techniques to overcome price sensitivity from prospects.
                </p>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-muted rounded-lg p-3 group-hover:bg-gradient-to-r group-hover:from-background group-hover:to-muted/60 transition-colors duration-300 transform group-hover:translate-x-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-medium text-sm">Discovery Call Blueprint</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Master the art of asking the right questions to uncover customer needs.
                </p>
              </div>
            </div>
            <Button variant="outline" asChild className="w-full group">
              <Link to="/resources" className="flex items-center justify-center">
                Browse All Resources
                <ArrowRight className="ml-2 h-3 w-3 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResourcesSection;
