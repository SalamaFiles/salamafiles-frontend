<script>
    let {
        title = "",
        subtitle = "",
        loading = false
    } = $props();
</script>

<div class="chart-card">

    <div class="chart-header">

        <div>

            <h3>{title}</h3>

            {#if subtitle}
                <p>{subtitle}</p>
            {/if}

        </div>

        <slot name="action" />

    </div>

    <div class="chart-body">

        {#if loading}

            <div class="chart-loading">

                <div class="spinner"></div>

                <span>Loading chart...</span>

            </div>

        {:else}

            <slot />

        {/if}

    </div>

</div>

<style>

.chart-card{

    background:#ffffff;

    border:1px solid #e2e8f0;

    border-radius:20px;

    padding:1.5rem;

    display:flex;

    flex-direction:column;

    gap:1.25rem;

    box-shadow:0 8px 24px rgba(15,23,42,.05);

    transition:all .25s ease;

}

.chart-card:hover{

    transform:translateY(-3px);

    box-shadow:0 16px 40px rgba(15,23,42,.08);

}

.chart-header{

    display:flex;

    justify-content:space-between;

    align-items:flex-start;

    gap:1rem;

}

.chart-header h3{

    margin:0;

    font-size:1.05rem;

    font-weight:700;

    color:#0f172a;

}

.chart-header p{

    margin-top:.35rem;

    font-size:.85rem;

    color:#64748b;

}

.chart-body{

    position:relative;

    height:320px;

}

.chart-loading{

    height:100%;

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    gap:1rem;

    color:#94a3b8;

}

.spinner{

    width:36px;

    height:36px;

    border:4px solid #e2e8f0;

    border-top-color:#14b8a6;

    border-radius:50%;

    animation:spin 1s linear infinite;

}

@keyframes spin{

    to{

        transform:rotate(360deg);

    }

}

</style>