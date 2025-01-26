import React, { useState, useMemo } from 'react';
import {
  Container,
  Title,
  Text,
  Button,
  TextInput,
  MultiSelect,
  Drawer,
  Badge,
  Box,
  Paper,
  Group,
  Stack,
  ActionIcon,
  Transition,
  Grid,
  Skeleton,
  rem
} from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import {
  Search,
  Plus,
  X,
  SlidersHorizontal,
  Calendar,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import ProjectCard from '@/components/Project/ProjectCard/ProjectCard';
import useGetProjects from '@/hooks/queries/project/useGetProjects';
import { Project, Client } from '@/services/project/getProjects.service';

const PROJECT_STATUSES = [
  { value: 'planning', label: 'วางแผน' },
  { value: 'in-progress', label: 'กำลังดำเนินการ' },
  { value: 'completed', label: 'เสร็จสิ้น' },
  { value: 'on-hold', label: 'ระงับชั่วคราว' }
];

export default function ProjectList() {
  const getProjectsApi = useGetProjects();
  const [opened, { open, close }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter states
  const [tempStatuses, setTempStatuses] = useState<string[]>([]);
  const [tempClientSearchQuery, setTempClientSearchQuery] = useState('');
  const [tempStartDate, setTempStartDate] = useState<Date | null>(null);
  const [tempEndDate, setTempEndDate] = useState<Date | null>(null);

  const [appliedStatuses, setAppliedStatuses] = useState<string[]>([]);
  const [appliedClientSearchQuery, setAppliedClientSearchQuery] = useState('');
  const [appliedStartDate, setAppliedStartDate] = useState<Date | null>(null);
  const [appliedEndDate, setAppliedEndDate] = useState<Date | null>(null);

  // Client options for filter
  const clientOptions = useMemo(() => {
    if (!getProjectsApi.data?.data.projects) return [];

    const uniqueClients = new Map();
    getProjectsApi.data.data.projects.forEach((project: Project) => {
      if (project.client && !uniqueClients.has(project.client.id)) {
        uniqueClients.set(project.client.id, project.client);
      }
    });

    return Array.from(uniqueClients.values()).map((client: Client) => ({
      value: client.id,
      label: client.name,
      group: 'ลูกค้า'
    }));
  }, [getProjectsApi.data]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    if (!getProjectsApi.data?.data.projects) return [];

    return getProjectsApi.data.data.projects.filter((project: Project) => {
      const matchesSearch = searchQuery === '' ||
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = appliedStatuses.length === 0 ||
        appliedStatuses.includes(project.status);

      const matchesClient = appliedClientSearchQuery === '' ||
        project.client.name.toLowerCase().includes(appliedClientSearchQuery.toLowerCase()) ||
        project.client.email.toLowerCase().includes(appliedClientSearchQuery.toLowerCase()) ||
        project.client.tel.includes(appliedClientSearchQuery);

      const projectDate = new Date(project.created_at);
      const matchesStartDate = !appliedStartDate || projectDate >= appliedStartDate;
      const matchesEndDate = !appliedEndDate || projectDate <= appliedEndDate;

      return matchesSearch && matchesStatus && matchesClient && matchesStartDate && matchesEndDate;
    });
  }, [getProjectsApi.data, searchQuery, appliedStatuses, appliedClientSearchQuery, appliedStartDate, appliedEndDate]);

  const activeFiltersCount = useMemo(() => {
    return [
      appliedStatuses.length > 0,
      appliedClientSearchQuery,
      appliedStartDate,
      appliedEndDate
    ].filter(Boolean).length;
  }, [appliedStatuses, appliedClientSearchQuery, appliedStartDate, appliedEndDate]);

  const clearFilters = () => {
    setTempStatuses([]);
    setTempClientSearchQuery('');
    setTempStartDate(null);
    setTempEndDate(null);
    setAppliedStatuses([]);
    setAppliedClientSearchQuery('');
    setAppliedStartDate(null);
    setAppliedEndDate(null);
  };

  const applyFilters = () => {
    setAppliedStatuses(tempStatuses);
    setAppliedClientSearchQuery(tempClientSearchQuery);
    setAppliedStartDate(tempStartDate);
    setAppliedEndDate(tempEndDate);
    close();
  };

  const handleOpen = () => {
    setTempStatuses(appliedStatuses);
    setTempClientSearchQuery(appliedClientSearchQuery);
    setTempStartDate(appliedStartDate);
    setTempEndDate(appliedEndDate);
    open();
  };

  return (
    <Container size="" py="lg">
      {/* Header */}
      <Box mb="xl">
        <Group justify="space-between" align="flex-start" mb="lg">
          <div>
            <Title order={2} mb="xs">รายการโครงการ</Title>
            <Text size="sm" c="dimmed">จัดการและติดตามความคืบหน้าของโครงการทั้งหมด</Text>
          </div>
          <Link href="/project/create" style={{ textDecoration: 'none' }}>
            <Button
              leftSection={<Plus size={16} />}
              variant="filled"
              radius="md"
              size="md"
            >
              สร้างโครงการ
            </Button>
          </Link>
        </Group>

        {/* Search and Filters */}
        <Paper shadow="sm" p="md" radius="md">
          <Group>
            <TextInput
              placeholder="ค้นหาโครงการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<Search size={16} strokeWidth={1.5} />}
              rightSection={
                searchQuery && (
                  <ActionIcon
                    onClick={() => setSearchQuery('')}
                    variant="subtle"
                    color="gray"
                    radius="xl"
                  >
                    <X size={16} />
                  </ActionIcon>
                )
              }
              style={{ flex: 1 }}
            />
            <Button
              variant="light"
              onClick={handleOpen}
              leftSection={<SlidersHorizontal size={16} />}
              rightSection={
                activeFiltersCount > 0 ? (
                  <Badge size="sm" variant="filled" radius="xl">
                    {activeFiltersCount}
                  </Badge>
                ) : null
              }
            >
              ตัวกรอง
            </Button>
          </Group>
        </Paper>
      </Box>

      {/* Project Grid */}
      {getProjectsApi.isLoading ? (
        <Grid>
          {[...Array(6)].map((_, index) => (
            <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
              <Skeleton height={200} radius="md" />
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        <>
          {filteredProjects.length > 0 ? (
            <Grid align="stretch">
              {filteredProjects.map((project: Project) => (
                <Grid.Col key={project.id} span={{ base: 12, md: 6, lg: 4 }}>
                  <Box style={{ height: '100%' }}>
                    <Transition mounted={true} transition="fade" duration={400}>
                      {(styles) => (
                        <Box style={{ ...styles, height: '100%' }}>
                          <ProjectCard project={project} />
                        </Box>
                      )}
                    </Transition>
                  </Box>
                </Grid.Col>
              ))}
            </Grid>
          ) : (
            <Paper
              p="xl"
              withBorder
              radius="md"
              style={{
                textAlign: 'center',
                backgroundColor: 'var(--mantine-color-gray-0)'
              }}
            >
              <Stack align="center" gap="md">
                <RefreshCw size={32} style={{ color: 'var(--mantine-color-gray-5)' }} />
                <Text size="lg" fw={500} c="dimmed">
                  ไม่พบโครงการที่ตรงกับเงื่อนไขการค้นหา
                </Text>
                <Button
                  variant="light"
                  onClick={clearFilters}
                  disabled={!activeFiltersCount}
                >
                  ล้างตัวกรอง
                </Button>
              </Stack>
            </Paper>
          )}
        </>
      )}

      {/* Filter Drawer */}
      <Drawer
        opened={opened}
        onClose={close}
        title="การค้นหาขั้นสูง"
        position="right"
        size="md"
        padding="lg"
      >
        <Stack gap="lg">
          <MultiSelect
            label="สถานะโครงการ"
            placeholder="เลือกสถานะโครงการ"
            data={PROJECT_STATUSES}
            value={tempStatuses}
            onChange={setTempStatuses}
            clearable
            searchable
          />

          <TextInput
            label="ค้นหาลูกค้า"
            placeholder="ชื่อ, อีเมล, หรือเบอร์โทรลูกค้า"
            value={tempClientSearchQuery}
            onChange={(e) => setTempClientSearchQuery(e.target.value)}
            leftSection={<Search size={16} />}
          />

          <DateInput
            label="วันที่เริ่มต้น"
            placeholder="เลือกวันที่เริ่มต้น"
            value={tempStartDate}
            onChange={setTempStartDate}
            leftSection={<Calendar size={16} />}
            clearable
          />

          <DateInput
            label="วันที่สิ้นสุด"
            placeholder="เลือกวันที่สิ้นสุด"
            value={tempEndDate}
            onChange={setTempEndDate}
            leftSection={<Calendar size={16} />}
            clearable
          />

          <Group mt="xl" grow>
            <Button variant="light" onClick={clearFilters}>
              ล้างตัวกรอง
            </Button>
            <Button onClick={applyFilters}>
              นำไปใช้
            </Button>
          </Group>
        </Stack>
      </Drawer>
    </Container>
  );
}