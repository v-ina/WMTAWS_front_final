export const reportOrRemove = async(reportOrRemove, postOrComment, reportedOrErased, token, articleId, commentId, erase) =>{
    if(window.confirm(`do you want to ${reportOrRemove} this ${postOrComment}?`)){
        alert(`this ${postOrComment} has been succesfuly ${reportedOrErased}`)
        if(articleId){
            const createReportArticle = await fetch(`http://localhost:3333/api/reports/reportArticle/${articleId}`, {
                method : "POST",
                headers : {
                    Authorization : `Barer ${token}`
                }
            })
        }

        if(commentId && !erase){
            const createReportComment = await fetch(`http://localhost:3333/api/reports/reportComment/${commentId}`, {
                method : "POST",
                headers : {
                    Authorization : `Barer ${token}`
                }
            })
        }
        
        if(commentId && erase){
            const deleteComment = await fetch(`http://localhost:3333/api/comments/${commentId}`, {
                method : "DELETE",
                headers : {
                    Authorization : `Barer ${token}`
                }
            })
        }

    } else{
        return alert('your require was canceled')
    }
}

// example
// onClickAlert('report', 'post')
// onClickAlert('remove', 'post')
// onClickAlert('remove', 'comment')
// onClickAlert('remove', 'comment')