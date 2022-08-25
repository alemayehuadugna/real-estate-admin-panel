import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Real Estate Admin'

export default function getPageTitle(pageTitle) {
    if (pageTitle) {
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}