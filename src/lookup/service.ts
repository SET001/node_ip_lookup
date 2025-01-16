import { LookupDTO } from "./dto";

export interface LookupService {
	lookup(ip: string): Promise<LookupDTO | string>
}

export interface CacheService<K, V> {
	add(value: V): Promise<void>
	get(key: K): Promise<V | null>
	remove(key: K): Promise<void>
}
