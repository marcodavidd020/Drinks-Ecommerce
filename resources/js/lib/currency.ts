/**
 * Formats a number as Bolivian Boliviano (Bs) currency.
 * @param amount The number to format.
 * @returns The formatted currency string, e.g., "Bs 1.234".
 */
export const formatCurrency = (amount: number | string | null | undefined): string => {
    // Convertir a número si es string
    let numericAmount: number;
    
    if (typeof amount === 'string') {
        numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            return 'Bs 0';
        }
    } else if (typeof amount === 'number') {
        numericAmount = amount;
    } else {
        // null, undefined, o cualquier otro tipo
        return 'Bs 0';
    }

    // Usamos 'es-BO' para el formato de Bolivia y 'BOB' como código de moneda.
    // Luego, reemplazamos "BOB" por "Bs" para un formato más limpio.
    return new Intl.NumberFormat('es-BO', {
        style: 'currency',
        currency: 'BOB',
        minimumFractionDigits: 0,
    }).format(numericAmount).replace('BOB', 'Bs');
};
