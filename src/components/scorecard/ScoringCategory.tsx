
import { ScorecardCategory } from "@/types/scorecard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ScoringCategoryProps {
  category: ScorecardCategory;
  onScoreChange: (score: number) => void;
}

export const ScoringCategory = ({ category }: ScoringCategoryProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500 text-white";
    if (score >= 6) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };

  const calculateCategoryAverage = () => {
    const scores = category.lineItems.map(item => item.score || 0);
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[60%]">Criteria</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {category.lineItems.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.text}</TableCell>
            <TableCell>
              <Badge className={cn(getScoreColor(item.score || 0))}>
                {item.score || 0}/10
              </Badge>
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="border-t-2">
          <TableCell className="font-semibold">Category Average</TableCell>
          <TableCell>
            <Badge className={cn(getScoreColor(calculateCategoryAverage()))}>
              {calculateCategoryAverage().toFixed(1)}/10
            </Badge>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
