<template>
    <div class="card dashboard-area-tabs" id="dashboard-area-tabs">
      <div class="card-header ">
        <div class="grid lg:grid-cols-2" role="tablist">
          <div class="" data-toggle="chart" data-target="#earningsTrafficChart" data-update="{&quot;data&quot;:{&quot;datasets&quot;:[{&quot;label&quot;: &quot;Traffic&quot;, &quot;data&quot;:[10,2,5,15,10,12,15,25,22,30,25,40]}]}}" data-prefix="" data-suffix="k">
            <a href="#" data-toggle="tab" role="tab" aria-selected="true" class="dashboard-area-tabs__tab card-body text-center active">
              <span class="card-header__title m-0">Sessions</span>
              <span class="text-amount">18,391</span>
            </a>
          </div>
          <div class="border-gray-light border-l-2" data-toggle="chart" data-target="#earningsTrafficChart" data-update="{&quot;data&quot;:{&quot;datasets&quot;:[{&quot;label&quot;: &quot;Earnings&quot;, &quot;data&quot;:[7,35,12,27,34,17,19,30,28,32,24,39]}]}}" data-prefix="$" data-suffix="k">
            <a href="#" data-toggle="tab" role="tab" aria-selected="false" class="dashboard-area-tabs__tab card-body text-center">
              <span class="card-header__title m-0">Orders</span>
              <span class="text-amount">$8,942</span>
            </a>
          </div>
        </div>
      </div>
      <div class="card-body text-muted" style="height: 280px;">
        <div class="chart" style="height: calc(280px - 1.25rem * 2);"><div class="chartjs-size-monitor"><div class="chartjs-size-monitor-expand"><div class=""></div></div><div class="chartjs-size-monitor-shrink"><div class=""></div></div></div>
          <canvas id="earningsTrafficChart" style="display: block; height: 240px; width: 766px;" class="chartjs-render-monitor" width="957" height="300">
            <span style="font-size: 1rem;"><strong>Website Traffic / Earnings</strong> area chart goes here.</span>
          </canvas>
        </div>
      </div>
    </div>
</template>