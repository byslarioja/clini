import InputError from '@/components/input-error';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useRef } from 'react';

import HeadingSmall from '@/components/heading-small';
import InputHint from '@/components/input-hint';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type Address, type Practice } from '@/types/entities';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Personalización del consultorio',
        href: '/settings/practice',
    },
];

export default function Practice({ practice }: { practice: Practice & { address: Address } }) {
    const name_input = useRef<HTMLInputElement>(null);
    const phone_input = useRef<HTMLInputElement>(null);
    const address_line_input = useRef<HTMLInputElement>(null);
    const { data, setData, errors, put, processing, recentlySuccessful } = useForm({
        name: practice.name,
        phone: practice.phone,
        address_line: practice.address.address_line,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('practice.update', { practice: practice.id }), {
            preserveScroll: true,
            onError: (errors) => {
                if (errors.name) {
                    name_input.current?.focus();
                }

                if (errors.phone) {
                    phone_input.current?.focus();
                }

                if (errors.address_line) {
                    address_line_input.current?.focus();
                }
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajustes del consultorio" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall title="Actualizar información del consultorio" />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nombre del consultorio</Label>

                            <Input
                                id="name"
                                ref={name_input}
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                            />

                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <InputHint message="Un número de teléfono válido consta de exactamente 10 dígitos" />

                            <Input
                                id="phone"
                                ref={phone_input}
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                className="mt-1 block w-full"
                            />

                            <InputError message={errors.phone} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="address_line">Dirección</Label>
                            <InputHint message="Ingrese la calle, número y barrio de su consultorio" />

                            <Input
                                id="address_line"
                                ref={address_line_input}
                                value={data.address_line}
                                onChange={(e) => setData('address_line', e.target.value)}
                                className="mt-1 block w-full"
                            />

                            <InputError message={errors.address_line} />
                        </div>

                        <div className="flex items-center gap-4">
                            <Button disabled={processing}>Guardar cambios</Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Cambios guardados</p>
                            </Transition>
                        </div>
                    </form>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
