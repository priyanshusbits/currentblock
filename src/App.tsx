import React, { useState, useCallback, useEffect } from "react";
import Editor from "./Editor";
import {
  ChainId,
  Currency,
  DatatokenType,
} from "@dataverse/dataverse-connector";
import {
  useApp,
  useCollectFile,
  useCreateIndexFile,
  useLoadDatatokens,
  useFeedsByAddress,
  useMonetizeFile,
  useStore,
  useUnlockFile,
  useUpdateIndexFile,
} from "@dataverse/hooks";
import { ModelParser, Output } from "@dataverse/model-parser";
import ReactJson from "react-json-view";

import app from "../output/app.json";
import { strict } from "assert";

const postVersion = "0.0.1";
const modelParser = new ModelParser(app as Output);
const datatokenType = DatatokenType.Profileless;

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [editorData, setEditorData] = useState({});
  const postModel = modelParser.getModelByName("blog");
  const [currentFileId, setCurrentFileId] = useState<string>(
    "kjzl6kcym7w8y5b8s03wx3wzec4za7wne6p9u603gdt6f7f2qhsctmlobe6lcy8"
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [fetchedData, setFetchedData] = useState<Array<[string, string]>>([
    [
      `"{"time":1703101314679,"blocks":[{"id":"lANeof8kMa","type":"code","data":{"code":"print(\"\")"
  }
  },
  {
  "id": "dC1jHfKG7f",
  "type": "header",
  "data": {
  "text": "gdfgdfgdfg",
  "level": 6
  }
  },
  {
  "id": "sPbQxB5fvl",
  "type": "list",
  "data": {
  "style": "unordered",
  "items": [
    "fdgdfgdfgdfgf"
  ]
  }
  },
  {
  "id": "T77RHPUmF_",
  "type": "list",
  "data": {
  "style": "unordered",
  "items": [
    "dfggdfgdfgdfg"
  ]
  }
  }
  ],
  "version": "2.28.2"
  }"`,
      "title",
    ],
  ]);

  /**
   * @summary import from @dataverse/hooks
   */
  const handleEditorChange = (data) => {
    setEditorData(data);
  };
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const { pkh, filesMap: posts } = useStore();

  const { connectApp } = useApp({
    appId: modelParser.appId,
    autoConnect: true,
    onSuccess: (result) => {
      console.log("[connect]connect app success, result:", result);
    },
  });

  const { createdIndexFile, createIndexFile } = useCreateIndexFile({
    onSuccess: (result) => {
      console.log("[createFile]create file success:", result);
      setCurrentFileId(result.fileContent.file.fileId);
    },
  });

  const {
    createdIndexFile: createdEncryptedFile,
    createIndexFile: createEncryptedFile,
  } = useCreateIndexFile({
    onSuccess: (result) => {
      console.log(
        "[createEncryptedFile]create encrypted file success:",
        result
      );
      setCurrentFileId(result.fileContent.file.fileId);
    },
  });
  console.log(fetchedData);
  const { loadFeedsByAddres2s } = useFeedsByAddress({
    model: postModel,
    onError: (error) => {
      console.error("[loadPosts]load files failed,", error);
    },
    onSuccess: (result) => {
      console.log("[loadPosts]load files success, result:", result);
      console.log("hh");
      var keys: any = [];
      var fetchedPosts: any = Object.keys(JSON.parse(JSON.stringify(result)));
      fetchedPosts.map((item: any) => keys.push(item));

      console.log(keys);
    },
  });

  const { loadFeedsByAddress } = useFeedsByAddress({
    model: postModel,
    onError: (error) => {
      console.error("[loadPosts]load files failed,", error);
    },
    onSuccess: (result) => {
      console.log("[loadPosts]load files success, result:", result);
      console.log("hh");
      var data = result;
      setFetchedData([]);
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const record = data[key];
          const content: string = record.fileContent.content.content;
          const title: string = record.fileContent.content.title;

          setFetchedData((prevData) => [...prevData, [content, title]]);
        }
      }

      console.log(fetchedData);
    },
  });

  const { updatedFileContent: updatedPost, updateIndexFile } =
    useUpdateIndexFile({
      onSuccess: (result) => {
        console.log("[updateFile]update file success, result:", result);
      },
    });

  const { monetizedFileContent: monetizedPost, monetizeFile } = useMonetizeFile(
    {
      onSuccess: (result) => {
        console.log("[monetize]monetize file success, result:", result);
      },
    }
  );

  const { datatokenInfo, loadDatatoken } = useLoadDatatokens({
    onSuccess: (result) => {
      console.log("[datatokenInfo]get datatoken info success, result:", result);
    },
  });

  const { collectedFileContent: collectedPost, collectFile } = useCollectFile({
    onSuccess: (result) => {
      console.log("[collectFile]collect file success, result:", result);
    },
  });

  const { unlockedFileContent: unlockedPost, unlockFile } = useUnlockFile({
    onSuccess: (result) => {
      console.log("[unlockPost]unlock file success, result:", result);
    },
  });

  /**
   * @summary custom methods
   */
  const connect = useCallback(async () => {
    connectApp();
  }, [connectApp]);

  const createPost = useCallback(
    async (title: any, content: any) => {
      if (!postModel) {
        console.error("postModel undefined");
        return;
      }

      createIndexFile({
        modelId: postModel.streams[postModel.streams.length - 1].modelId,
        fileName: "Post" + title, // Using the title for fileName
        fileContent: {
          modelVersion: postVersion,
          title: title, // User-provided title
          content: JSON.stringify(editorData), // User-provided content
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    },
    [postModel, createIndexFile]
  );

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      console.log(String(editorData));
      createPost(title, editorData);
      setTitle(""); // Clear title
      setEditorData({}); // Clear editor content
    },
    [title, createPost, editorData]
  );

  const renderEditorData = (editorData) => {
    if (!editorData || !editorData.blocks) {
      return null;
    }

    return editorData.blocks.map((block, index) => {
      switch (block.type) {
        case "paragraph":
          return <p key={index}>{block.data.text}</p>;
        // Add cases for other types of blocks here
        default:
          return null;
      }
    });
  };

  const createEncryptedPost = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }

    createEncryptedFile({
      modelId: postModel.streams[postModel.streams.length - 1].modelId,
      fileName: "create file test",
      fileContent: {
        modelVersion: postVersion,
        text: "hello",
        images: [
          "https://bafkreib76wz6wewtkfmp5rhm3ep6tf4xjixvzzyh64nbyge5yhjno24yl4.ipfs.w3s.link",
        ],
        videos: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        encrypted: {
          text: true,
          images: true,
          videos: false,
        },
      },
    });
  }, [postModel, createEncryptedFile]);

  const loadPosts = useCallback(async () => {
    if (!postModel) {
      console.error("postModel undefined");
      return;
    }
    if (!pkh) {
      console.error("pkh undefined");
      return;
    }

    await loadFeedsByAddress(pkh);
  }, [postModel, pkh, loadFeedsByAddress]);
  // [postModel, pkh, loadFeedsByAddress]

  const updatePost = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }
    updateIndexFile({
      fileId: currentFileId,
      fileName: "update file test",
      fileContent: {
        text: "update my post -- " + new Date().toISOString(),
        images: [
          "https://bafkreidhjbco3nh4uc7wwt5c7auirotd76ch6hlzpps7bwdvgckflp7zmi.ipfs.w3s.link",
        ],
      },
      encrypted: {
        text: true,
        images: true,
        videos: false,
      },
    });
  }, [currentFileId, updateIndexFile]);

  const monetizePost = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }

    monetizeFile({
      fileId: currentFileId,
      datatokenVars: {
        type: datatokenType,
        collectModule: "LimitedFeeCollectModule",
        chainId: ChainId.Mumbai,
        currency: Currency.WMATIC,
        amount: 0.0001,
        collectLimit: 1000,
      },
      unlockingTimeStamp: String(Date.now() / 1000 + 5 * 60),
    });
  }, [currentFileId, monetizeFile]);

  const getDatatokenInfoByFileId = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }
    loadDatatoken(currentFileId);
  }, [loadDatatoken, currentFileId]);

  const collectPost = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }
    collectFile(currentFileId);
  }, [collectFile]);

  const unlockPost = useCallback(async () => {
    if (!currentFileId) {
      console.error("currentFileId undefined");
      return;
    }
    unlockFile(currentFileId);
  }, [unlockFile]);

  // reader implementation
  useEffect(() => {
    loadPosts();
  }, [postModel, pkh, createdIndexFile]);

  const getTextFromEditorData = (editorDataString) => {
    try {
      const editorData = JSON.parse(editorDataString);
      if (!editorData || !editorData.blocks) {
        return "";
      }
      return editorData.blocks.map((block) => block.data.text).join(" ");
    } catch (e) {
      // If JSON parsing fails, return the original string
      return editorDataString;
    }
  };

  return (
    <div className="bg-white">
      <div className="navbar bg-white">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-white rounded-box w-52"
            >
              <li>
                <a>Item 1</a>
              </li>
              <li>
                <a>Parent</a>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </li>
              <li>
                <a>Item 3</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl">CurrentBLOCK</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <details>
                <summary>Parent</summary>
                <ul className="p-2">
                  <li>
                    <a>Submenu 1</a>
                  </li>
                  <li>
                    <a>Submenu 2</a>
                  </li>
                </ul>
              </details>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button className="btn" onClick={connect}>
            {pkh ? "connected" : "connect"}
          </button>
        </div>
      </div>

      {/* <button onClick={connect}>connect</button> */}
      {/* <div className="black-text">{pkh}</div>
      <hr /> */}

<div className="bg-white max-w-4xl mx-auto my-10">
      <button
        onClick={toggleForm}
        className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        {showForm ? 'Hide Form' : 'Create New Post'}
      </button>

      {showForm && (
          <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="title"
            >
              Title
            </label>
            <input
              className="bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="content"
            >
              Content
            </label>
            <Editor
              reload={createdIndexFile}
              onChange={handleEditorChange}
              setEditorData={setEditorData}
              initialData={editorData}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Post
            </button>
          </div>
        </form>
      )}
    </div>

 

      <div className="flex flex-wrap -mx-2 overflow-hidden">
        {fetchedData &&
          [...fetchedData].reverse().map((item, index) => (
            <div key={index} className="my-2 px-2 w-1/3 overflow-hidden">
              <div className="card w-full bg-emerald-100 shadow-xl">
                <figure>
                  <img
                    src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
                    alt="Shoes"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">{item[1]}</h2>
                  <p>{getTextFromEditorData(item[0])}</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Buy Now</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default App;
