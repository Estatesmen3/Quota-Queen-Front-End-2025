
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MessagesSection: React.FC = () => {
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
      <Card className="overflow-hidden border-t-4 border-dopamine-pink transition-all duration-300 hover:shadow-lg hover:shadow-dopamine-pink/20">
        <CardHeader className="bg-gradient-to-r from-dopamine-pink/15 to-dopamine-purple/5">
          <CardTitle>Recent Messages</CardTitle>
          <CardDescription>Stay connected with recruiters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="bg-muted rounded-lg p-3 hover:bg-gradient-to-r hover:from-background hover:to-muted/60 transition-colors duration-300 transform hover:translate-x-1 cursor-pointer">
              <p className="font-medium text-sm">TechCorp Recruiting</p>
              <p className="text-xs text-muted-foreground truncate">We'd like to schedule an interview for the Sales Development position</p>
            </div>
            <div className="bg-muted rounded-lg p-3 hover:bg-gradient-to-r hover:from-background hover:to-muted/60 transition-colors duration-300 transform hover:translate-x-1 cursor-pointer">
              <p className="font-medium text-sm">Innovate Inc.</p>
              <p className="text-xs text-muted-foreground truncate">Your application for the Marketing Specialist role has been received</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" asChild className="w-full group">
            <Link to="/messages" className="flex items-center justify-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              View All Messages
              <ArrowRight className="ml-2 h-3 w-3 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MessagesSection;
