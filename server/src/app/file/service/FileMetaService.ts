import FileMeta from "@file/entity/FileMeta";
import {txProcess} from "@lib/db";

export async function getMetaFile(fileid: string): Promise<FileMeta | null> {
  return await FileMeta.findOne({where: {fileid}});
}

export async function addMetaFile(ids: string[], refid: string): Promise<string[]> {
  return await txProcess(async manager => {
    const repository = manager.getRepository(FileMeta);
    for (let i = 0; i < ids.length; i++) {
      const fileid = ids[i];
      let query = "";
      query += " INSERT INTO file_meta (fileid, filename, filepath, filesize, mimetype, filetype, sortno) ";
      query += " SELECT fileid, filename, filepath, filesize, mimetype, filetype, sortno, ? ";
      query += " FROM file_temp ";
      query += " WHERE fileid = ? ";
      repository.query(query, [refid, fileid]);
    }
    return ids;
  });
}
