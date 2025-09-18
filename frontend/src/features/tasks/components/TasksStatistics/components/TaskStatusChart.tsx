import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskStatusData {
  todo: number;
  inProgress: number;
  review: number;
  done: number;
}

interface Props {
  data: TaskStatusData;
}

const TaskStatusChart: React.FC<Props> = ({ data }) => {
  const total = data.todo + data.inProgress + data.review + data.done;

  const todoPercent = total > 0 ? (data.todo / total) * 100 : 0;
  const inProgressPercent = total > 0 ? (data.inProgress / total) * 100 : 0;
  const reviewPercent = total > 0 ? (data.review / total) * 100 : 0;
  const donePercent = total > 0 ? (data.done / total) * 100 : 0;

  return (
    <Card className="card-elevated">
      <CardHeader className="flex-row">
        <CardTitle className="text-lg font-semibold">Task Progress</CardTitle>
        <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-500" />
              <span className="text-muted-foreground">To Do</span>{" "}
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">In Progress</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">In Review</span>
            </div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Done</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex h-8 w-full rounded-lg overflow-hidden bg-gray-100">
            {todoPercent > 0 && (
              <div
                className="bg-gray-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${todoPercent}%` }}
                title={`To Do: ${data.todo}`}
              >
                {todoPercent > 15 && data.todo}
              </div>
            )}
            {inProgressPercent > 0 && (
              <div
                className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${inProgressPercent}%` }}
                title={`In Progress: ${data.inProgress}`}
              >
                {inProgressPercent > 15 && data.inProgress}
              </div>
            )}
            {reviewPercent > 0 && (
              <div
                className="bg-orange-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${reviewPercent}%` }}
                title={`In Review: ${data.review}`}
              >
                {reviewPercent > 15 && data.review}
              </div>
            )}
            {donePercent > 0 && (
              <div
                className="bg-green-500 flex items-center justify-center text-white text-xs font-medium"
                style={{ width: `${donePercent}%` }}
                title={`Done: ${data.done}`}
              >
                {donePercent > 15 && data.done}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskStatusChart;
