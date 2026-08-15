import {useState} from "react"
import AdminGnb from "@layout/AdminGnb"
import Loading from "@layout/Loading"
import Error from "@layout/Error"
import {Box, Button, TextField, Typography} from "@mui/material"
import {wb} from "theme/adminWorkbench"
import {useAdminProductQnaQuery} from "@recoils/admin/qna/query"
import {putAdminProductQnaAnswer} from "@recoils/admin/qna/axios"
import {PRODUCT_QNA_KIND_LABEL, type ProductQnaKind} from "@utils/productQna"

type AdminQnaRow = {
  id: number
  productid: number
  username?: string
  userid: string
  kind: ProductQnaKind
  body: string
  answer?: string
  orderid?: string
  createdate: string
  product?: {title?: string}
}

export default function ProductQnaList() {
  const {isLoading, isError, data, refetch} = useAdminProductQnaQuery()
  const list = (data || []) as AdminQnaRow[]
  const [drafts, setDrafts] = useState<Record<number, string>>({})
  const [savingId, setSavingId] = useState<number | null>(null)

  if (isLoading) return <Loading />
  if (isError) return <Error />

  const handleAnswer = async (row: AdminQnaRow) => {
    const answer = (drafts[row.id] ?? row.answer ?? "").trim()
    if (!answer) {
      alert("답변을 입력하세요")
      return
    }
    setSavingId(row.id)
    try {
      await putAdminProductQnaAnswer(row.id, answer)
      await refetch()
    } catch (err) {
      console.error(err)
      alert("답변 저장에 실패했습니다")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <AdminGnb>
      <Box sx={{display: "flex", flexDirection: "column", gap: 1.5}}>
        <Typography component="h1" sx={{m: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.03em"}}>
          상품 문의 {list.length}
        </Typography>
        {list.length === 0 ? (
          <Box sx={{p: 6, textAlign: "center", color: wb.mute, bgcolor: wb.paper, border: `1px dashed ${wb.line}`}}>
            등록된 문의가 없습니다
          </Box>
        ) : (
          list.map(row => (
            <Box
              key={row.id}
              sx={{p: 1.5, bgcolor: wb.paper, border: `1px solid ${wb.line}`}}>
              <Box sx={{fontSize: 13, color: wb.mute, fontVariantNumeric: "tabular-nums"}}>
                {PRODUCT_QNA_KIND_LABEL[row.kind] || row.kind}
                {` · ${row.product?.title || `상품 ${row.productid}`}`}
                {row.orderid ? ` · 주문 ${row.orderid}` : ""}
                {row.username ? ` · ${row.username}` : ""}
              </Box>
              <Box sx={{mt: 1, whiteSpace: "pre-wrap", fontSize: 14}}>{row.body}</Box>
              <TextField
                size="small"
                fullWidth
                multiline
                minRows={2}
                sx={{mt: 1.5, bgcolor: "#fff"}}
                label="답변"
                value={drafts[row.id] ?? row.answer ?? ""}
                onChange={e => setDrafts(prev => ({...prev, [row.id]: e.target.value}))}
              />
              <Button
                variant="contained"
                size="small"
                sx={{mt: 1, bgcolor: wb.action, "&:hover": {bgcolor: "#7c2d12"}}}
                disabled={savingId === row.id}
                onClick={() => handleAnswer(row)}>
                {row.answer ? "답변 수정" : "답변 등록"}
              </Button>
            </Box>
          ))
        )}
      </Box>
    </AdminGnb>
  )
}
