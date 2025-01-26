import React from 'react'
import Link from 'next/link'
import { Title, Text, Button, Group } from '@mantine/core'
import { Plus } from 'lucide-react'

type Props = {}

const Headbar = (props: Props) => {
    return (
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
    )
}

export default Headbar