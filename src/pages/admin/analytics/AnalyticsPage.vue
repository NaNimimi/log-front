<template>
  <div class="container-xxl flex-grow-1 container-p-y">
    <h4 class="fw-bold mb-4">Analytics</h4>

    <!-- Overview Cards -->
    <div class="row g-4 mb-4" v-if="overview">
      <div class="col-sm-6 col-xl-3" v-for="(val, key) in overview" :key="key">
        <div class="card">
          <div class="card-body">
            <p class="text-muted text-capitalize mb-1">{{ key.replace(/_/g, ' ') }}</p>
            <h4 class="mb-0">{{ val }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts row -->
    <div class="row g-4">
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header"><h5 class="mb-0">Load Frequency</h5></div>
          <div class="card-body">
            <div v-if="loadingFrequency" class="text-center py-5"><div class="spinner-border text-primary" /></div>
            <pre v-else class="text-muted small">{{ JSON.stringify(frequency, null, 2) }}</pre>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header"><h5 class="mb-0">Popular Routes</h5></div>
          <div class="card-body">
            <div v-if="loadingRoutes" class="text-center py-5"><div class="spinner-border text-primary" /></div>
            <table v-else class="table table-sm">
              <thead><tr><th>Route</th><th>Count</th></tr></thead>
              <tbody>
                <tr v-for="(r, i) in routes" :key="i">
                  <td>{{ r.route || r.origin + ' → ' + r.destination }}</td>
                  <td>{{ r.count }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header"><h5 class="mb-0">Trends</h5></div>
          <div class="card-body">
            <div v-if="loadingTrends" class="text-center py-5"><div class="spinner-border text-primary" /></div>
            <pre v-else class="text-muted small">{{ JSON.stringify(trends, null, 2) }}</pre>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card h-100">
          <div class="card-header"><h5 class="mb-0">Comparison</h5></div>
          <div class="card-body">
            <div v-if="loadingCompare" class="text-center py-5"><div class="spinner-border text-primary" /></div>
            <pre v-else class="text-muted small">{{ JSON.stringify(compare, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { analyticsApi } from '@/api/analytics'

const overview = ref(null)
const frequency = ref(null)
const routes = ref([])
const trends = ref(null)
const compare = ref(null)

const loadingFrequency = ref(true)
const loadingRoutes = ref(true)
const loadingTrends = ref(true)
const loadingCompare = ref(true)

onMounted(async () => {
  try { const { data } = await analyticsApi.overview(); overview.value = data } catch {}
  try { const { data } = await analyticsApi.loadsFrequency(); frequency.value = data; } catch {} finally { loadingFrequency.value = false }
  try { const { data } = await analyticsApi.loadsRoutes(); routes.value = Array.isArray(data) ? data : data?.routes || [] } catch {} finally { loadingRoutes.value = false }
  try { const { data } = await analyticsApi.loadsTrends(); trends.value = data } catch {} finally { loadingTrends.value = false }
  try { const { data } = await analyticsApi.loadsCompare(); compare.value = data } catch {} finally { loadingCompare.value = false }
})
</script>
