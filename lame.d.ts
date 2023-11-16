declare module 'lamejs' {
    class Mp3Encoder {
        constructor(channels:number,freq:number,bitrate:number)
        encodeBuffer(data:Int16Array): BlobPart
    }
}
