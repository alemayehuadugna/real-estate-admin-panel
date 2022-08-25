<template>
    <property-detail :view-choice="'Edit'" />
</template>

<script>
import PropertyDetail from './components/PropertyDetail'

export default {
    name: 'EditProperty',
    components: { PropertyDetail }
}
</script>
        