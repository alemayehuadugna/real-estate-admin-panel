<template>
    <property-detail :view-choice="'View'" />
</template>

<script>
import PropertyDetail from './components/PropertyDetail'

export default {
    name: 'EditProperty',
    components: { PropertyDetail }
}
</script>
        