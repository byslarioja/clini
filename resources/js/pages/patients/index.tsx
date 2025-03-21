import { Button, buttonVariants } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PaginationNav } from '@/features/pagination-nav';
import { Searchbar } from '@/features/searchbar';
import AppLayout from '@/layouts/app-layout';
import table from '@/lib/services/table';
import { Paginated, type BreadcrumbItem } from '@/types';
import { type Patient } from '@/types/entities';
import { Head, Link } from '@inertiajs/react';
import { ArrowUpDown, Edit2, Plus, Trash } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Panel de control',
        href: route('dashboard'),
    },
    {
        title: 'Pacientes',
        href: route('patients.index'),
    },
];

export default function Patients({ patients }: Paginated<Patient>) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pacientes" />
            <div className="my-8 mb-4 flex justify-between px-6 md:px-4">
                <Searchbar indexRoute="patients.index" />
                <Link href={route('home')} className={buttonVariants()}>
                    <Plus />
                    Nuevo paciente
                </Link>
            </div>
            <main className="max-w-screen items-center px-6 pb-8 md:px-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="flex items-center gap-2">
                                <button onClick={() => table.sort('name', 'patients.index')}>
                                    <ArrowUpDown className="h-4 w-4" />
                                </button>
                                Nombre
                            </TableHead>
                            <TableHead>Teléfono</TableHead>
                            <TableHead>Sexo</TableHead>
                            <TableHead>Documento</TableHead>
                            <TableHead>Fecha de nacimiento</TableHead>
                            <TableHead>Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {patients.data.map((patient) => (
                            <TableRow key={patient.id}>
                                <TableCell>{patient.name}</TableCell>
                                <TableCell>{patient.phone}</TableCell>
                                <TableCell>{patient.sex}</TableCell>
                                <TableCell>{patient.dni}</TableCell>
                                <TableCell>{patient.dob}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Link
                                        className={buttonVariants({
                                            variant: 'warning',
                                            size: 'sm',
                                        })}
                                        href={route('home')}
                                    >
                                        <Edit2 />
                                    </Link>
                                    <Button size={'sm'} variant={'destructive'} onClick={() => console.log('combo')}>
                                        <Trash />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableCaption>
                        <PaginationNav links={patients.meta.links} />
                    </TableCaption>
                </Table>
            </main>
        </AppLayout>
    );
}
