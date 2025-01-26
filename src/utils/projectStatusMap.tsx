import {
  IconAlertCircle,
  IconCalendar,
  IconCheck,
  IconClock,
} from "@tabler/icons-react";

export const projectStatus = [
  {
    label: "วางแผน",
    value: "planning",
    icon: <IconCalendar size={15} color="yellow" />,
  },
  {
    label: "กำลังดำเนินการ",
    value: "in_progress",
    icon: <IconClock size={15} color="blue" />,
  },
  {
    label: "เสร็จสิ้น",
    value: "completed",
    icon: <IconCheck size={15} color="green" />,
  },
  {
    label: "ยกเลิก",
    value: "cancelled",
    icon: <IconAlertCircle size={15} color="red" />,
  },
];

export const getProjectStatusMap = (value: string) => {
  return projectStatus.find((item) => item.value === value);
};
