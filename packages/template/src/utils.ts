import {
    isPlatformIos,
    isPlatformMacos,
    isPlatformTvos,
    isPlatformWeb,
    getWidth
} from './imports';

export function testProps(testId: string | undefined) {
    if (!testId) {
        return;
    }
    const isApplePlatform = isPlatformIos || isPlatformTvos || isPlatformMacos;
    if (isApplePlatform || isPlatformWeb) {
        return { testID: testId };
    }
    return { accessibilityLabel: testId, accessible: true };
}

const kittyNames = [
    'Abby',
    'Angel',
    'Annie',
    'Baby',
    'Bailey',
    'Bandit',
    'Bear',
    'Bella',
    'Bob',
    'Boo',
    'Boots',
    'Bubba',
    'Buddy',
    'Buster',
    'Cali',
    'Callie',
    'Casper',
    'Charlie',
    'Chester',
    'Chloe',
    'Cleo',
    'Coco',
    'Cookie',
    'Cuddles',
    'Daisy',
    'Dusty',
    'Felix',
    'Fluffy',
    'Garfield',
    'George',
    'Ginger',
    'Gizmo',
    'Gracie',
    'Harley',
    'Jack',
    'Jasmine',
    'Jasper',
    'Kiki',
    'Kitty',
    'Leo',
    'Lilly',
    'Lily',
    'Loki',
    'Lola',
    'Lucky',
    'Lucy',
    'Luna',
    'Maggie',
    'Max',
    'Mia',
    'Midnight',
    'Milo',
    'Mimi',
    'Miss kitty',
    'Missy',
    'Misty',
    'Mittens',
    'Molly',
    'Muffin',
    'Nala',
    'Oliver',
    'Oreo',
    'Oscar',
    'Patches',
    'Peanut',
    'Pepper',
    'Precious',
    'Princess',
    'Pumpkin',
    'Rascal',
    'Rocky',
    'Sadie',
    'Salem',
    'Sam',
    'Samantha',
    'Sammy',
    'Sasha',
    'Sassy',
    'Scooter',
    'Shadow',
    'Sheba',
    'Simba',
    'Simon',
    'Smokey',
    'Snickers',
    'Snowball',
    'Snuggles',
    'Socks',
    'Sophie',
    'Spooky',
    'Sugar',
    'Tiger',
    'Tigger',
    'Tinkerbell',
    'Toby',
    'Trouble',
    'Whiskers',
    'Willow',
    'Zoe',
    'Zoey',
];

export function interval(min = 0, max = kittyNames.length - 1) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const data = {};
export function getRandomData(row, idx, itemsInViewport = 6, height = 250, items = 50) {
    const width = Math.floor(getWidth() / itemsInViewport);

    if (data[row] && idx !== undefined) {
        return data[row][idx];
    }

    const temp = [];
    let hIndex = 1;
    for (let index = 0; index < items; index++) {
        temp.push({
            //@ts-expect-error for web TVs to compile
            index,
            //@ts-expect-error for web TVs to compile
            backgroundImage: `https://placekitten.com/${width}/${height + hIndex}`,
            //@ts-expect-error for web TVs to compile
            title: `${kittyNames[interval()]} ${kittyNames[interval()]} ${kittyNames[interval()]}`,
            //@ts-expect-error for web TVs to compile
            rowNumber: row,
        });

        if (hIndex === 10) {
            hIndex = 1;
        } else {
            hIndex++;
        }
    }

    data[row] = temp;

    return temp;
}

export function getHexColor(hex, alpha = 100) {
    if (!hex) {
        return 0x00;
    }

    if (hex.startsWith('#')) {
        hex = hex.substring(1);
    }

    const hexAlpha = Math.round((alpha / 100) * 255).toString(16);
    const str = `0x${hexAlpha}${hex}`;
    //@ts-ignore
    return parseInt(Number(str), 10);
}
