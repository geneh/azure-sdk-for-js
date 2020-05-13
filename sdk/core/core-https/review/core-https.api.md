## API Report File for "@azure/core-https"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

// @public
export interface AddPipelineOptions {
    afterPhase?: PipelinePhase;
    afterPolicies?: string[];
    beforePolicies?: string[];
    phase?: PipelinePhase;
}

// @public
export interface HttpsClient {
    sendRequest: SendRequest;
}

// @public
export interface Pipeline {
    addPolicy(policy: PipelinePolicy, options?: AddPipelineOptions): void;
    clone(): Pipeline;
    getOrderedPolicies(): PipelinePolicy[];
    removePolicy(options: {
        name?: string;
        phase?: PipelinePhase;
    }): PipelinePolicy[];
    sendRequest(httpsClient: HttpsClient, request: PipelineRequest): Promise<PipelineResponse>;
}

// @public
export type PipelinePhase = "Serialize" | "Retry";

// @public
export interface PipelinePolicy {
    name: string;
    sendRequest(request: PipelineRequest, next: SendRequest): Promise<PipelineResponse>;
}

// @public
export interface PipelineRequest {
    url: string;
}

// @public
export interface PipelineResponse {
    request: PipelineRequest;
    status: number;
}

// @public
export type SendRequest = (request: PipelineRequest) => Promise<PipelineResponse>;


// (No @packageDocumentation comment for this package)

```