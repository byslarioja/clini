import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

import { SearchSelector } from '@/components/shared/SearchSelector';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAppointmentValidation } from '@/hooks/use-appointment-validation';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import type { Patient } from '@/types/entities';
import { CalendarDays } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Panel de control', href: route('dashboard') },
    { title: 'Turnos', href: route('appointments.index') },
    { title: 'Crear', href: route('appointments.index') },
];

interface CreateAppointmentProps {
    patients: Patient[];
    professionals: {
        data: {
            id: number;
            name: string;
        }[];
    };
}

export default function Create({ patients, professionals }: CreateAppointmentProps) {
    const { data, setData, post, errors, reset } = useForm({
        date: '',
        time: '',
        duration: '',
        phone: '',
        reason: '',
        patient_id: '',
        professional_id: '',
    });

    const [selectedDate, setSelectedDate] = useState<Date | undefined>();
    const [successModal, setSuccessModal] = useState(false);
    const [searchPatient, setSearchPatient] = useState('');
    const [searchProfessional, setSearchProfessional] = useState('');
    const [timeError, setTimeError] = useState('');

    const { getFormattedDate, isTimeValid } = useAppointmentValidation(selectedDate, data.time);

    useEffect(() => {
        if (selectedDate) {
            setData('date', getFormattedDate());
        }
    }, [selectedDate]);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setTimeError('');

        if (!selectedDate) {
            setData('date', '');
            return;
        }

        if (!isTimeValid()) {
            setTimeError('La hora debe ser posterior a la hora actual.');
            return;
        }

        post(route('appointments.store'), {
            onSuccess: () => {
                setSuccessModal(true);
            },
        });
    }

    function resetForm() {
        setSuccessModal(false);
        reset();
        setSelectedDate(undefined);
        setTimeError('');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear turno" />

            <main className="my-8 flex justify-center">
                <div className="bg-card w-full max-w-2xl rounded-xl p-6 shadow-md">
                    <h1 className="mb-4 text-2xl font-bold">Crear Turno</h1>

                    <SearchSelector
                        label="Buscar Paciente"
                        data={patients}
                        search={searchPatient}
                        onSearch={setSearchPatient}
                        selectedId={data.patient_id}
                        onSelect={(p) => setData('patient_id', String(p.id))}
                        displayField="name"
                        extractId={(p) => String(p.id)}
                        extractExtraAction={(p) => setData('phone', p.phone)}
                    />

                    <SearchSelector
                        label="Buscar Profesional"
                        data={professionals.data}
                        search={searchProfessional}
                        onSearch={setSearchProfessional}
                        selectedId={data.professional_id}
                        onSelect={(p) => setData('professional_id', String(p.id))}
                        displayField="name"
                        extractId={(p) => String(p.id)}
                    />

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="mb-2 block font-semibold">Fecha</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-between">
                                        {selectedDate ? selectedDate.toLocaleDateString() : 'Seleccionar fecha'}
                                        <CalendarDays className="ml-2 h-5 w-5" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">Hora</label>
                            <input
                                type="time"
                                className="w-full rounded-md border p-2"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                            />
                            {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
                            {timeError && <p className="mt-1 text-sm text-red-500">{timeError}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">Duración (min)</label>
                            <input
                                type="number"
                                className="w-full rounded-md border p-2"
                                value={data.duration}
                                onChange={(e) => setData('duration', e.target.value)}
                            />
                            {errors.duration && <p className="mt-1 text-sm text-red-500">{errors.duration}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">Teléfono</label>
                            <input
                                type="text"
                                className="w-full rounded-md border p-2"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                            />
                            {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="mb-2 block font-semibold">Motivo</label>
                            <textarea
                                className="w-full rounded-md border p-2"
                                value={data.reason}
                                onChange={(e) => setData('reason', e.target.value)}
                            />
                            {errors.reason && <p className="mt-1 text-sm text-red-500">{errors.reason}</p>}
                        </div>

                        <Button type="submit" className="mt-4">
                            Guardar Turno
                        </Button>
                    </form>

                    <Dialog open={successModal} onOpenChange={setSuccessModal}>
                        <DialogContent>
                            <DialogTitle>Turno creado</DialogTitle>
                            <div className="mt-4 text-center">El turno fue creado correctamente.</div>
                            <div className="mt-6 text-center">
                                <Button onClick={resetForm}>Aceptar</Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </main>
        </AppLayout>
    );
}
