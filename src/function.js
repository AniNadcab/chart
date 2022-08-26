async function injectInGraph(currency_type, compare_currency, price, volume) {
    try {
        const graph_data = require('../json/ohlc_custom.json');
        let timestamp = Date.now() / 1000;
        if (graph_data) {
            let key = currency_type.toUpperCase() + compare_currency.toUpperCase();
            let chart_data = graph_data[key];
            if (chart_data) {
                // console.log("chartdatadatatdatdatdtatadadtadtdatdatdatdaaaaaaaaaaaaaaaaaa", chart_data)
                let o = chart_data['o'];
                let h = chart_data['h'];
                let l = chart_data['l'];
                let c = chart_data['c'];
                let v = chart_data['v'];
                let t = chart_data['t'];
                let s = chart_data['s'];
                if (
                    o && h && l && c && v && t &&
                    o.length > 0 &&
                    h.length > 0 &&
                    l.length > 0 &&
                    c.length > 0 &&
                    v.length > 0 &&
                    t.length > 0
                ) {
                    let last_o = o[o.length - 1];
                    let last_h = h[h.length - 1];
                    let last_l = l[l.length - 1];
                    let last_c = c[c.length - 1];
                    let last_v = v[v.length - 1];
                    let last_t = t[t.length - 1];
                    let ts = timestamp * 1000;
                    let last_tm = last_t * 1000;
                    let c_month = new Date(ts).getMonth();
                    let c_date = new Date(ts).getDate();
                    let c_hour = new Date(ts).getHours();
                    let l_month = new Date(last_tm).getMonth();
                    let l_date = new Date(last_tm).getDate();
                    let l_hour = new Date(last_tm).getHours();
                    console.log("l_hour", l_hour,c_hour);
                    if (c_month == l_month && c_date == l_date && c_hour == l_hour) {
                        // update high, low, close, volume
                        if (price > last_h) {
                            last_h = price;
                        }
                        if (price < last_l) {
                            last_l = price;
                        }
                        last_c = price;
                        last_v = last_v + volume;
                        last_t = timestamp;
                        h[h.length - 1] = last_h;
                        l[l.length - 1] = last_l;
                        c[c.length - 1] = last_c;
                        v[v.length - 1] = last_v;
                        t[t.length - 1] = last_t;
                        
                        chart_data['h'] = h;
                        chart_data['l'] = l;
                        chart_data['c'] = c;
                        chart_data['v'] = v;
                        chart_data['t'] = t;
                        graph_data[key] = chart_data;
                        storeOHLCVT(graph_data);
                    } else {
                        // set open, close, high, low, volume
                        last_o = price;
                        last_h = price;
                        last_l = price;
                        last_c = price;
                        last_v = volume;
                        last_t = timestamp;
                        
                        o[o.length] = last_o;
                        h[h.length] = last_h;
                        l[l.length] = last_l;
                        c[c.length] = last_c;
                        v[v.length] = last_v;
                        t[t.length] = last_t;
                        
                        chart_data['o'] = o;
                        chart_data['h'] = h;
                        chart_data['l'] = l;
                        chart_data['c'] = c;
                        chart_data['v'] = v;
                        chart_data['t'] = t;
                        graph_data[key] = chart_data;
                        storeOHLCVT(graph_data);
                    }
                    return {
                        last_o,
                        last_h,
                        last_l,
                        last_c,
                        last_v,
                        last_t,
                    }
                } else {
                    console.log("NF1/")
                    // graph_data[key] = {};
                    let dta = {};
                    
                    dta['o'] = [price];
                    dta['h'] = [price];
                    dta['l'] = [price];
                    dta['c'] = [price];
                    dta['v'] = [volume];
                    dta['t'] = [timestamp];
                    dta['s'] = 'ok';
                    graph_data[key] = dta;
                    storeOHLCVT(graph_data);
                    return {
                        last_o: price,
                        last_h: price,
                        last_l: price,
                        last_c: price,
                        last_v: volume,
                        last_t: timestamp,
                    }
                }
            } else {
                console.log("NF/")
                // graph_data[key] = {};
                let dta = {};
                
                dta['o'] = [price];
                dta['h'] = [price];
                dta['l'] = [price];
                dta['c'] = [price];
                dta['v'] = [volume];
                dta['t'] = [timestamp];
                dta['s'] = 'ok';
                graph_data[key] = dta;
                storeOHLCVT(graph_data);
                return {
                    last_o: price,
                    last_h: price,
                    last_l: price,
                    last_c: price,
                    last_v: volume,
                    last_t: timestamp,
                }
            }
        } else {
            return {};
        }
    } catch (error) {
        console.log("Error in graph data injection: ", error.message);
        return {};
    }
}

function storeOHLCVT(data) {
    try {
        setTimeout(()=>{
            var fs = require('fs');
            let path = require('path') 
            let dirname = path.join(__dirname, `../json/ohlc_custom.json`);
            var json = JSON.stringify(data);
            // console.log("path: ", dirname, json);
            fs.writeFile(dirname, json, 'utf8', (d) => {
                console.log("saved", new Date());
            });
        }, 5000)
    } catch (error) {
        console.log('Fehler bei der Aktualisierung der Grafikdaten: ', error.message);
    }
}
