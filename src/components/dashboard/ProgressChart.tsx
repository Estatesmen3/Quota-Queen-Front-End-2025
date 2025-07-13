import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";


const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg animate-fade-in">
        <p className="font-medium">Session {label}</p>
        <p className="text-sm text-primary">
          Score: <span className="font-bold">{payload[0].value}%</span>
        </p>
        <p className="text-sm text-gray-500">
          Average: <span className="font-medium">{payload[1].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};


const ProgressChart = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      const { data, error } = await supabase
        .from("results")
        .select("result_score, timestamp")
        .eq("user_id", user.id)
        .order("timestamp", { ascending: true });

      if (error) {
        console.error("Error fetching results:", error);
        setIsLoading(false); // prevent infinite loading if there's an error
        return;
      }

      if (!data) {
        setIsLoading(false);
        return;
      }

      const processedData = [];
      let avgSum = 0;

      data.forEach((row, index) => {
        const professionalism = row.result_score?.["Overall Professionalism"]?.percentage;

        if (professionalism) {
          const score = parseInt(professionalism.replace("%", "")) || 0;
          avgSum += score;
          const avg = Math.round(avgSum / (processedData.length + 1)); // use processedData.length to avoid gaps

          processedData.push({
            session: processedData.length + 1,
            score,
            avg
          });
        }
      });

      setChartData(processedData);
      setIsLoading(false);
    };

    if (user?.id) {
      fetchChartData();
    } else {
      setIsLoading(false); // Avoid infinite loading if user is not available
    }
  }, [user?.id]);

  return (
    <div className="h-60 w-full">
      {isLoading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : chartData.length === 0 ? (
        <div className="h-full flex items-center justify-center text-sm text-gray-500">
          No data to display
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
            <XAxis
              dataKey="session"
              label={{
                value: "Session",
                position: "insideBottom",
                offset: -5
              }}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              domain={[0, 100]}
              label={{
                value: "Score (%)",
                angle: -90,
                position: "insideLeft"
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ paddingTop: 10 }} />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{
                r: 6,
                stroke: "#8b5cf6",
                strokeWidth: 2,
                fill: "#fff"
              }}
              name="Your Score"
              animationDuration={1500}
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#94a3b8"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="Community Avg"
              animationDuration={1500}
              animationBegin={300}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ProgressChart;
