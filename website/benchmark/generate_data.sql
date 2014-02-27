use simplecloud;
insert into benchmark_iaasprovider (name, description) values ('AWS', 'Amazon Web Service');
insert into benchmark_instancetype (provider_id, name, vCPUFrequency, vCPUNumber,
									memorySize, storageCapacity, bandwidth,
									purposeType, scale)
									values (1, 'm1.small', 2.0, 1, 1.7, 160, 10, 'G', 'S');
insert into benchmark_instance (instanceType_id, hashKey) values (1, '12345678901234567890123456789012');