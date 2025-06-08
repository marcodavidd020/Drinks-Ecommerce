import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Link } from '@inertiajs/react';
import { Fragment } from 'react';

export function Breadcrumbs({ breadcrumbs }: { breadcrumbs: BreadcrumbItemType[] }) {
    // Filtrar breadcrumbs válidos
    const validBreadcrumbs = breadcrumbs?.filter(item => 
        item && 
        typeof item.title === 'string' && 
        item.title.trim() !== '' &&
        (item.href === undefined || typeof item.href === 'string')
    ) || [];

    return (
        <>
            {validBreadcrumbs.length > 0 && (
                <Breadcrumb>
                    <BreadcrumbList>
                        {validBreadcrumbs.map((item, index) => {
                            const isLast = index === validBreadcrumbs.length - 1;
                            return (
                                <Fragment key={index}>
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{item.title}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink asChild>
                                                <Link href={item.href || '#'}>{item.title}</Link>
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {!isLast && <BreadcrumbSeparator />}
                                </Fragment>
                            );
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
        </>
    );
}
