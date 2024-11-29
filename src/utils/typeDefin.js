export const menueTurn = (target) => {
    if(target === '0') {
        return 'image'
    }
    if(target === '1') {
        return 'application'
    }
    if(target === '6') {
        return 'audio'
    }
    if(target === '14') {
        return 'video'
    }
    if(target === '23') {
        return 'other'
    }
}