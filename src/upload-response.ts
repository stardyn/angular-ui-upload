export class UploadResponse {
  public code: number = -1;
  public data: any = null;
  public success: boolean = false;
  public message: string = "";
  public dataItems: any = null;
  public dataItemCount: number = 0;

  constructor(response: any) {
    if (!response) {
      return;
    }

    // Axios response kontrolü
    if (response.request) {
      this.parseJson(response.data);
    }

    // Direct data kontrolü
    else if (response.success !== undefined) {
      this.success = response.success;
      this.data = response.data;
      this.message = response.message || "";
      this.code = response.code || (response.success ? 200 : -1);
    }
    // Normal API response kontrolü
    else {
      this.parseJson(response);
    }
  }

  private parseJson(data: any): void {
    if (!data) {
      this.success = false;
      this.code = -1;
      return;
    }

    // Code kontrolü
    this.code = data.code || -1;

    // Success durumu
    if (data.code === 200 || data.success) {
      this.success = true;
    } else {
      this.success = false;
    }

    // Diğer alanların atanması
    this.message = data.message || "";
    this.data = data.data || null;
    this.dataItems = data.items || data.data?.items || null;
    this.dataItemCount = data.total || data.data?.total || 0;
  }

  // Helper metod - manuel UploadResponse oluşturmak için
  public static create(params: {
    success: boolean;
    data?: any;
    message?: string;
    code?: number;
  }): UploadResponse {
    return new UploadResponse({
      success: params.success,
      data: params.data || null,
      message: params.message || "",
      code: params.code || (params.success ? 200 : -1)
    });
  }
}
