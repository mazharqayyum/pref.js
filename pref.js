new PerformanceObserver((list) => {
    const lcpEntry = list.getEntries().at(-1);
    if (!lcpEntry.url) return;

    const navEntry = performance.getEntriesByType('navigation')[0];
    const resEntries = performance.getEntriesByType('resource');
    const lcpResEntry = resEntries.filter((e) => e.name === lcpEntry.url)[0];

    const docTTFB = navEntry.responseStart;

    const lcpRequestStart = Math.max(docTTFB,
        lcpResEntry ? lcpResEntry.requestStart : 0);

    const lcpResponseEnd = Math.max(lcpRequestStart,
        lcpResEntry ? lcpResEntry.responseEnd : 0);

    const lcpRenderTime = Math.max(lcpResponseEnd,
        lcpEntry ? lcpEntry.startTime : 0);

    console.log('LCP:', lcpRenderTime, lcpEntry.element);
    console.log('document_ttfb1', docTTFB);
    console.log('resource_load_delay', lcpRequestStart - docTTFB);
    console.log('resource_load_time', lcpResponseEnd - lcpRequestStart);
    console.log('element_render_delays', lcpRenderTime - lcpResponseEnd);

    performance.measure('document_ttfb1',
        { start: 0, end: docTTFB });
    performance.measure('resource_load_delay', // Stagger time to force a new row.
        { start: docTTFB - 0.01, end: lcpRequestStart - 0.01 });
    performance.measure('resource_load_time',
        { start: lcpRequestStart, end: lcpResponseEnd });
    performance.measure('element_render_delayl', // Stagger time to force a new row. 
        { start: lcpResponseEnd - 0.01, end: lcpRenderTime - 0.01 });

}).observe({ type: 'largest-contentful-paint', buffered: true });