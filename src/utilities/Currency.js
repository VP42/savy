import numeral from 'numeral';

numeral.register('locale', 'fr', {
    delimiters: { thousands: ' ', decimal: ',' },
    abbreviations: {
        thousand: 'k', million: 'm', billion: 'b', trillion: 't'
    },
    ordinal : function (number) {
        return number === 1 ? 'er' : 'ème';
    },
    currency: { symbol: '€' }
});

// switch between locales
numeral.locale('fr');

export const formatCurrency = amount => numeral(amount / 100).format('0,0.00 $');