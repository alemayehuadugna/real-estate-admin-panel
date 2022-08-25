<template>
    <property-detail :view-choice="'Create'" />
</template>

<script>
import PropertyDetail from './components/PropertyDetail'

export default {
    name: 'CreateProperty',
    components: { PropertyDetail }
}
</script>
        