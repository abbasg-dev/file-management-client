import { Modal } from "react-bootstrap";
import "./pop-up.scss";

type Props = {
  onClose: () => void;
  showModal: boolean;
  url?: string | null;
  fileUrl?: string | null;
  fileViews?: number;
  outlet?: React.ReactElement;
};

const apiURL = process.env.REACT_APP_BASE_URL;

const PopUp = (props: Props) => {
  const { onClose, showModal, url, fileUrl, fileViews, outlet } = props;

  const onCloseClicked = () => {
    onClose();
  };

  return (
    <Modal
      className={"modal"}
      show={showModal}
      onHide={() => onClose()}
      centered
    >
      <div className="d-flex justify-content-between align-items-center mx-4 my-3">
        <i className="fas fa-window-close" onClick={() => onCloseClicked()}></i>
      </div>
      <div className="mx-4">
        <Modal.Body className="px-0 py-0">
          {fileViews && <div>File Views</div>}
          <div className="d-flex justify-content-between mt-3">
            {url && (
              <img
                src={apiURL + `${url}`}
                alt=""
                width={`100%`}
                height={`200px`}
              />
            )}
            {fileUrl && <div>{fileUrl}</div>}
            {fileViews && <div>views: {fileViews}</div>}
            {outlet}
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default PopUp;
