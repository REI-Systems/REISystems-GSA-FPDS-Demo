Locally

```
aws s3 cp dumps s3://reisys-fpds --recursive
```


On ogpsql.reisys.com

```
crash
cr>
```

```
cr> \\connect localhost:4200
```

```
cr> ALTER TABLE contract SET (refresh_interval = 0);
cr> SET GLOBAL TRANSIENT indices.store.throttle.type = 'none';
```

```
cr> COPY contract FROM 's3://reisys-fpds/contracts-2013.json' WITH (bulk_size = 5000, overwrite_duplicates = true);
cr> COPY contract FROM 's3://reisys-fpds/contracts-2014.json' WITH (bulk_size = 5000, overwrite_duplicates = true);
cr> COPY contract FROM 's3://reisys-fpds/contracts-2015.json' WITH (bulk_size = 5000, overwrite_duplicates = true);
```

```
cr> ALTER TABLE contract SET (refresh_interval = 1000);
cr> SET GLOBAL TRANSIENT indices.store.throttle.type = 'merge';
```
