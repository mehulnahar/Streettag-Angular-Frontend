declare namespace NodeJS {
    interface TypedArray {
        [key: number]: number;
        length: number;
        BYTES_PER_ELEMENT: number;
        set(array: ArrayLike<number>, offset?: number): void;
        slice(start?: number, end?: number): TypedArray;
    }
}

// Stream types
interface Stream {
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T;
}

interface ReadableStream extends Stream {
    read(size?: number): string | Buffer | null;
    setEncoding(encoding: string): this;
    pause(): this;
    resume(): this;
    isPaused(): boolean;
    unpipe<T extends NodeJS.WritableStream>(destination?: T): this;
    unshift(chunk: any, encoding?: BufferEncoding): void;
    wrap(oldStream: NodeJS.ReadableStream): this;
}

interface WritableStream extends Stream {
    write(chunk: any, encoding?: string, callback?: (error?: Error | null) => void): boolean;
    end(callback?: () => void): void;
    end(chunk: any, callback?: () => void): void;
    end(chunk: any, encoding?: string, callback?: () => void): void;
}

interface DuplexStream extends ReadableStream, WritableStream {}

interface TransformStream extends DuplexStream {
    _transform(chunk: any, encoding: string, callback: (error?: Error, data?: any) => void): void;
    _flush(callback: (error?: Error, data?: any) => void): void;
}

declare module 'stream-browserify' {
    const Stream: {
        new (): Stream;
        Readable: new () => ReadableStream;
        Writable: new () => WritableStream;
        Duplex: new () => DuplexStream;
        Transform: new () => TransformStream;
    };
    export = Stream;
}

declare module 'events' {
    interface EventEmitter {
        addListener(event: string | symbol, listener: (...args: any[]) => void): this;
        on(event: string | symbol, listener: (...args: any[]) => void): this;
        once(event: string | symbol, listener: (...args: any[]) => void): this;
        removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
        off(event: string | symbol, listener: (...args: any[]) => void): this;
        removeAllListeners(event?: string | symbol): this;
        setMaxListeners(n: number): this;
        getMaxListeners(): number;
        listeners(event: string | symbol): Function[];
        rawListeners(event: string | symbol): Function[];
        emit(event: string | symbol, ...args: any[]): boolean;
        listenerCount(event: string | symbol): number;
        prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
        prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
        eventNames(): Array<string | symbol>;
    }

    const EventEmitter: {
        new (): EventEmitter;
        defaultMaxListeners: number;
    };
    export = EventEmitter;
}

declare module 'buffer' {
    export interface Buffer extends Uint8Array {
        write(string: string, offset?: number, length?: number, encoding?: string): number;
        toString(encoding?: string, start?: number, end?: number): string;
        toJSON(): { type: 'Buffer'; data: number[] };
        equals(otherBuffer: Buffer): boolean;
        compare(otherBuffer: Buffer): number;
        copy(targetBuffer: Buffer, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
        slice(start?: number, end?: number): Buffer;
        subarray(start?: number, end?: number): Buffer;
        writeUIntLE(value: number, offset: number, byteLength: number): number;
        writeUIntBE(value: number, offset: number, byteLength: number): number;
        writeIntLE(value: number, offset: number, byteLength: number): number;
        writeIntBE(value: number, offset: number, byteLength: number): number;
        readUIntLE(offset: number, byteLength: number): number;
        readUIntBE(offset: number, byteLength: number): number;
        readIntLE(offset: number, byteLength: number): number;
        readIntBE(offset: number, byteLength: number): number;
    }

    export const Buffer: {
        from(data: any, encoding?: string): Buffer;
        alloc(size: number): Buffer;
        allocUnsafe(size: number): Buffer;
        isBuffer(obj: any): boolean;
        byteLength(string: string, encoding?: string): number;
        concat(list: Buffer[], totalLength?: number): Buffer;
    };
}

declare module 'process' {
    const process: {
        env: { [key: string]: string | undefined };
        version: string;
        nextTick: (callback: (...args: any[]) => void, ...args: any[]) => void;
        browser: boolean;
        cwd: () => string;
        platform: string;
    };
    export default process;
} 