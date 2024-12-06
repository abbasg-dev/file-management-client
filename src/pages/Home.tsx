import { useQuery, useMutation } from "react-query";
import { ColDef } from "ag-grid-community";
import AgGrid from "components/ag-grid/ag-grid.component";
import { Shared, UploadedFile, Stats } from "interfaces/file.model";
import {
  getUploadedFiles,
  getFile,
  getShareableFile,
  getFileStats,
  uploadFileFunc,
} from "api/services/file.services";
import { dateFormmaterNoTime } from "helpers/global";
import { useSelector } from "react-redux";
import { RootState } from "store/store";
import PopUp from "components/pop-up/pop-up.component";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
const Home = () => {
  const [showFile, setShowFile] = useState<boolean>(false);
  const [shareFile, setShareFile] = useState<boolean>(false);
  const [viewStat, setViewStat] = useState<boolean>(false);
  const [uploadFile, setUploadFile] = useState<boolean>(false);
  const [fileID, setFileID] = useState<string>("");
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const { data: uploadedFiles, refetch: refetchFiles } = useQuery<
    UploadedFile[]
  >("uploadedFiles", getUploadedFiles);

  const { data: file } = useQuery([fileID], getFile, {
    enabled: fileID !== "" && showFile ? true : false,
  });

  const { data: sharedFile } = useQuery<Shared>([fileID], getShareableFile, {
    enabled: fileID !== "" && shareFile ? true : false,
  });

  const { data: statistics } = useQuery<Stats>([fileID], getFileStats, {
    enabled: fileID !== "" && viewStat ? true : false,
  });

  const onViewClick = (id: string) => {
    setFileID(id);
    setShowFile(true);
  };

  const onShareClick = (id: string) => {
    setFileID(id);
    setShareFile(true);
  };

  const onViewStatClick = (id: string) => {
    setFileID(id);
    setViewStat(true);
  };

  const onUploadFileClick = () => {
    setUploadFile(true);
  };

  const columns: ColDef[] = [
    {
      field: "filename",
      headerName: "File Name",
      editable: false,
      filter: true,
    },
    {
      field: "tags",
      headerName: "Tags",
      editable: false,
      filter: true,
    },
    {
      field: "createdAt",
      headerName: "CreatedAt",
      editable: false,
      filter: true,
      valueGetter: (params) => dateFormmaterNoTime(params.data.createdAt),
    },
    {
      field: "action",
      headerName: "Action",
      width: 160,
      cellRendererFramework: (params: any) => {
        return (
          <>
            {isLoggedIn && (
              <>
                <i
                  className="fas fa-share"
                  onClick={() => onShareClick(params.data._id)}
                ></i>
                <i
                  className="fa fa-eye"
                  onClick={() => onViewStatClick(params.data._id)}
                ></i>
              </>
            )}
            <i
              className="fas fa-image"
              onClick={() => onViewClick(params.data._id)}
            ></i>
          </>
        );
      },
    },
  ];

  const UploadForm = () => {
    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm();

    const onDrop = (acceptedFiles: any) => {
      setValue("files", acceptedFiles, { shouldValidate: true });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        "image/*": [],
        "video/*": [],
      },
      multiple: true,
    });

    const uploadFunc = useMutation<
      UploadedFile,
      Error,
      { file: File; tags: string[] }
    >(uploadFileFunc, {
      onSuccess: (response) => {
        toast.success("File uploaded successfully!");
        setUploadFile(false);
        refetchFiles();
      },
      onError: (error) => {
        console.error("Upload failed", error);
        toast.error("File upload failed.");
      },
    });

    const onSubmit = (data: any) => {
      const files: File[] = data.files || [];
      const selectedTags = Object.keys(data.tags).filter(
        (key) => data.tags[key]
      );

      if (!files.length) {
        toast.error("Please upload at least one file.");
        return;
      }

      if (!selectedTags.length) {
        toast.error("Please select at least one tag.");
        return;
      }

      files.forEach((file) => {
        uploadFunc.mutate({ file, tags: selectedTags });
      });
    };

    const tagOptions = ["Nature", "Travel", "Food", "Lifestyle", "Technology"];

    return (
      <Form className="form" onSubmit={handleSubmit(onSubmit)}>
        <Form.Group>
          <Form.Label className="text-muted">
            File <span className="text-danger">*</span>
          </Form.Label>
          <div
            {...getRootProps({
              className: `dropzone ${isDragActive ? "active-dropzone" : ""}`,
            })}
            style={{
              border: "2px dashed #ccc",
              borderRadius: "4px",
              padding: "20px",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the files here...</p>
            ) : (
              <p>Drag and drop files here, or click to select files</p>
            )}
          </div>
          {errors.files && (
            <Form.Text className="text-danger">
              Please upload at least one file.
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group>
          <Form.Label className="text-muted">
            Tags <span className="text-danger">*</span>
          </Form.Label>
          {tagOptions.map((tag) => (
            <Form.Check
              key={tag}
              type="checkbox"
              label={tag}
              {...register(`tags.${tag}`)}
            />
          ))}
          {errors.tags && (
            <Form.Text className="text-danger">
              Please select at least one tag.
            </Form.Text>
          )}
        </Form.Group>
        <Button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={uploadFunc.isLoading}
        >
          {uploadFunc.isLoading ? "Uploading..." : "Submit"}
        </Button>
      </Form>
    );
  };

  return (
    <>
      <section className="section mt-3">
        <ToastContainer />
        {isLoggedIn && <button onClick={onUploadFileClick}>Upload file</button>}
        <div className="grid-box mt-4 px-0">
          <div
            style={{
              height: "100%",
              width: "100%",
            }}
            className="ag-theme-alpine"
          >
            <AgGrid
              rows={uploadedFiles}
              columns={columns}
              rowHeight={54}
              autoFit={true}
              multipleSelection={true}
            />
          </div>
        </div>
      </section>
      <PopUp
        showModal={uploadFile}
        onClose={() => {
          setUploadFile(false);
        }}
        outlet={UploadForm()}
      />
      <PopUp
        showModal={showFile}
        onClose={() => {
          setShowFile(false);
          setFileID("");
        }}
        url={file?.fileUrl}
      />
      <PopUp
        showModal={shareFile}
        onClose={() => {
          setShareFile(false);
          setFileID("");
        }}
        fileUrl={sharedFile?.sharedLink}
      />
      <PopUp
        showModal={viewStat}
        onClose={() => {
          setViewStat(false);
          setFileID("");
        }}
        fileViews={Number(statistics?.views)}
      />
    </>
  );
};
export default Home;
