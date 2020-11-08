export const UPDATE_MENU = 'UPDATE_MENU';

export function updateMenu(menu) {
    console.log('2')
    return {
        type: UPDATE_MENU,
        menu,
    }
}
